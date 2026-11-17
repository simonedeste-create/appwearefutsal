import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../../src/components/MatchCard';
import { Card, Crest, Empty, IconButton, Loading, PillButton, Screen, Section, useWatch } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { useTeamMap } from '../../src/data/useTeams';
import { colors, space, type } from '../../src/theme';

export default function Squadra() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teams = useTeamMap();
  const team = useData(() => data.team(String(id)), [id]);
  const roster = useData(() => data.players(String(id)), [id]);
  const watch = useWatch();
  const matches = useData(() => data.matches({ teamId: String(id) }), [id]);
  if (team.loading) return <Screen back title="Squadra"><Loading /></Screen>;
  const t = team.value;
  if (!t) return <Screen back title="Squadra"><Empty text="Squadra non trovata" /></Screen>;
  const next = (matches.value ?? []).filter((m) => m.status !== 'finished').slice(0, 2);
  const last = (matches.value ?? []).filter((m) => m.status === 'finished').slice(-2).reverse();
  return (
    <Screen back title="Squadra" right={<IconButton name="star-outline" label="Segui la squadra" />}>
      <View style={st.hero}>
        <Crest short={t.short} color={t.color} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={st.name}>{t.name}</Text>
          <Text style={[type.small, { color: colors.white, opacity: 0.8 }]}>📍 {t.venue}</Text>
        </View>
      </View>
      <View style={{ marginTop: space.m }}>
        <PillButton label="Tutte le partite su FUTSAL TV" icon="tv-outline" variant="live" onPress={() => watch(t.futsalTvUrl ?? config.futsalTv.teamUrl(t.name))} />
      </View>
      {next.length ? <><Section title="Prossime gare" />{next.map((m) => <MatchCard key={m.id} match={m} home={teams[m.homeId]} away={teams[m.awayId]} />)}</> : null}
      {last.length ? <><Section title="Ultimi risultati" />{last.map((m) => <MatchCard key={m.id} match={m} home={teams[m.homeId]} away={teams[m.awayId]} />)}</> : null}
      <Section title="Rosa" />
      <Card>
        {(roster.value ?? []).map((p, i) => (
          <Pressable key={p.id} onPress={() => router.push(`/giocatore/${p.id}`)} style={[st.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
            <Text style={st.num}>{p.number}</Text>
            <View style={{ flex: 1 }}><Text style={st.pName}>{p.name}</Text><Text style={st.role}>{p.role}</Text></View>
            <Text style={st.goals}>{p.stats.goals} gol</Text>
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: colors.bluElettrico, borderRadius: 20, padding: space.l, flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { color: colors.white, fontSize: 26, fontWeight: '900', textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  num: { color: colors.lime, fontSize: 18, fontWeight: '900', width: 28, textAlign: 'center' },
  pName: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  role: { color: colors.muted, fontSize: 12 },
  goals: { color: colors.muted, fontSize: 12, fontWeight: '700' },
});
