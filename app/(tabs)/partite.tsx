import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../../src/components/MatchCard';
import { Card, Chips, Crest, Empty, Loading, Screen } from '../../src/components/ui';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { useTeamMap } from '../../src/data/useTeams';
import { colors, space, type } from '../../src/theme';

export default function Partite() {
  const params = useLocalSearchParams<{ c?: string }>();
  const [comp, setComp] = useState(params.c ?? 'serie-a');
  const [view, setView] = useState<'partite' | 'classifica'>('partite');
  const [round, setRound] = useState<number | undefined>(undefined);
  const teams = useTeamMap();
  const comps = useData(() => data.competitions());
  const rounds = useData(() => data.rounds(comp), [comp]);
  useEffect(() => { if (params.c) setComp(params.c); }, [params.c]);
  useEffect(() => { setRound(rounds.value?.current); }, [rounds.value]);
  const matches = useData(() => (round ? data.matches({ competitionId: comp, round }) : Promise.resolve([])), [comp, round]);
  const table = useData(() => data.standings(comp), [comp]);
  const active = comps.value?.find((c) => c.id === comp)?.active ?? true;

  return (
    <Screen title="Partite">
      <Chips
        items={(comps.value ?? []).map((c) => ({ id: c.id, label: c.name, color: c.gender === 'F' ? colors.rosa : undefined }))}
        value={comp}
        onChange={(v) => { setComp(v); setRound(undefined); }}
      />
      <Chips items={[{ id: 'partite', label: 'Partite' }, { id: 'classifica', label: 'Classifica' }]} value={view} onChange={setView} />

      {!active ? <Empty text="Calendario e risultati di questo campionato saranno disponibili quando sarà collegata la fonte dati." /> : view === 'partite' ? (
        <>
          {rounds.value ? (
            <View style={st.roundBar}>
              <Pressable disabled={!round || round <= 1} onPress={() => setRound((r) => (r ?? 1) - 1)} hitSlop={10}><Text style={st.arrow}>‹</Text></Pressable>
              <Text style={[type.title, { color: colors.ink }]}>{round}ª giornata</Text>
              <Pressable disabled={!round || round >= rounds.value.total} onPress={() => setRound((r) => (r ?? 0) + 1)} hitSlop={10}><Text style={st.arrow}>›</Text></Pressable>
            </View>
          ) : null}
          {matches.loading ? <Loading /> : (matches.value ?? []).map((m) => (
            <MatchCard key={m.id} match={m} home={teams[m.homeId]} away={teams[m.awayId]} />
          ))}
        </>
      ) : (
        <Card style={{ paddingHorizontal: 10, paddingVertical: 4, marginTop: space.s }}>
          <View style={[st.tr, { borderTopWidth: 0 }]}>
            {['#', 'Squadra', 'G', 'V', 'N', 'P', 'DR', 'Pt'].map((h, i) => <Text key={h} style={[st.th, i === 1 && st.teamCol]}>{h}</Text>)}
          </View>
          {(table.value ?? []).map((r, i) => {
            const t = teams[r.teamId];
            return (
              <Pressable key={r.teamId} style={st.tr} onPress={() => router.push(`/squadra/${r.teamId}`)}>
                <Text style={[st.td, i < 4 && { color: colors.lime }]}>{i + 1}</Text>
                <View style={[st.teamCol, { flexDirection: 'row', alignItems: 'center', gap: 8 }]}>
                  <Crest short={t?.short ?? ''} color={t?.color ?? colors.line} size={22} />
                  <Text style={[st.td, { textAlign: 'left', flex: 1 }]} numberOfLines={1}>{t?.name}</Text>
                </View>
                <Text style={st.td}>{r.played}</Text><Text style={st.td}>{r.won}</Text><Text style={st.td}>{r.drawn}</Text><Text style={st.td}>{r.lost}</Text>
                <Text style={st.td}>{r.goalsFor - r.goalsAgainst > 0 ? '+' : ''}{r.goalsFor - r.goalsAgainst}</Text>
                <Text style={[st.td, { color: colors.lime, fontWeight: '900' }]}>{r.points}</Text>
              </Pressable>
            );
          })}
        </Card>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  roundBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: space.m, marginHorizontal: 4 },
  arrow: { color: colors.muted, fontSize: 26, paddingHorizontal: 8 },
  tr: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: colors.line },
  th: { width: 30, color: colors.muted, fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' },
  td: { width: 30, color: colors.ink, fontSize: 13, textAlign: 'center' },
  teamCol: { flex: 1, width: undefined, textAlign: 'left' },
});
