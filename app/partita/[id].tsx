import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { fmtDay, fmtTime } from '../../src/components/MatchCard';
import { BroadcastBadge, Card, Chips, Crest, Empty, IconButton, LiveBadge, Loading, PillButton, Screen, Section, openUrl, useWatch } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import { calendarUrl, useFan } from '../../src/fan';
import { useData } from '../../src/data/useData';
import { useTeamMap } from '../../src/data/useTeams';
import { colors, space, type } from '../../src/theme';

export default function Partita() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teams = useTeamMap();
  const match = useData(() => data.match(String(id)), [id]);
  const [tab, setTab] = useState<'cronaca' | 'formazioni'>('cronaca');
  const watch = useWatch();
  const fan = useFan();
  const homeP = useData(() => (match.value ? data.players(match.value.homeId) : Promise.resolve([])), [match.value]);
  const awayP = useData(() => (match.value ? data.players(match.value.awayId) : Promise.resolve([])), [match.value]);
  if (match.loading) return <Screen back title="Match center"><Loading /></Screen>;
  const m = match.value;
  if (!m) return <Screen back title="Match center"><Empty text="Partita non trovata" /></Screen>;
  const h = teams[m.homeId]; const a = teams[m.awayId];
  const played = m.status !== 'scheduled';
  const team = (tid: string, side: 'h' | 'a') => (
    <Pressable style={st.team} onPress={() => router.push(`/squadra/${tid}`)}>
      <Crest short={teams[tid]?.short ?? '?'} color={teams[tid]?.color ?? colors.line} size={52} />
      <Text style={st.teamName}>{(side === 'h' ? h : a)?.name}</Text>
    </Pressable>
  );
  const channel = m.broadcast?.channel ?? 'FUTSAL TV';
  return (
    <Screen back title="Match center" right={<IconButton name="notifications-outline" label="Attiva notifiche per questa partita" />}>
      <View style={st.hero}>
        <Text style={[type.label, { color: colors.muted, textAlign: 'center' }]}>{m.roundLabel} · {fmtDay(m.date)}</Text>
        <View style={st.scoreRow}>
          {team(m.homeId, 'h')}
          <Text style={st.score}>{played ? `${m.homeScore} – ${m.awayScore}` : fmtTime(m.date)}</Text>
          {team(m.awayId, 'a')}
        </View>
        <View style={{ alignItems: 'center' }}>{m.status === 'live' ? <LiveBadge clock={m.clock} /> : <Text style={{ color: colors.muted, fontSize: 12 }}>{m.status === 'finished' ? 'Finale' : 'In programma'}</Text>}</View>
        <Text style={st.venue}>📍 {m.venue}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: space.s }}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>{m.status === 'finished' ? 'Trasmessa su' : 'In diretta su'}</Text>
          <BroadcastBadge channel={channel} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: space.s, marginVertical: space.m }}>
        <PillButton label={m.status === 'finished' ? `Rivedi su ${channel === 'Sky Sport' ? 'FUTSAL TV' : channel}` : `Guarda su ${channel}`} icon="play" variant="live" onPress={() => watch(m.status === 'finished' ? (m.futsalTvUrl ?? config.futsalTv.url) : (m.broadcast?.url ?? m.futsalTvUrl ?? config.futsalTv.url))} />
        <PillButton label="Condividi" icon="share-social-outline" variant="ghost" onPress={() => { Share.share({ message: `${h?.name} – ${a?.name} · ${m.roundLabel} · ${fmtDay(m.date)}. Seguila su We are futsal! #WeAreFutsal` }).catch(() => undefined); }} />
      </View>
      {m.status === 'scheduled' ? (
        <View style={{ marginBottom: space.s }}>
          <PillButton label="Aggiungi al calendario" icon="calendar-outline" variant="ghost" onPress={() => openUrl(calendarUrl(`${h?.name} – ${a?.name}`, m.date, m.venue))} />
        </View>
      ) : null}
      {m.status === 'finished' ? (
        <>
          <Section title="Vota l'MVP" />
          <Card style={{ padding: 12 }}>
            {fan.mvp(m.id) ? <Text style={st.hint}>Hai votato: {[...(homeP.value ?? []), ...(awayP.value ?? [])].find((p) => p.id === fan.mvp(m.id))?.name}. Tocca un altro nome per cambiare.</Text> : <Text style={st.hint}>Scegli il migliore in campo.</Text>}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.s, marginTop: space.s }}>
              {[...(homeP.value ?? []).slice(0, 5), ...(awayP.value ?? []).slice(0, 5)].map((p) => {
                const on = fan.mvp(m.id) === p.id;
                return (
                  <Pressable key={p.id} onPress={() => fan.setMvp(m.id, p.id)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[st.mv, on && st.pickOn]}>
                    <Text style={[st.mvT, on && { color: colors.onLime }]} numberOfLines={1}>{p.number} {p.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>
        </>
      ) : null}
      <Chips items={[{ id: 'cronaca', label: 'Cronaca' }, { id: 'formazioni', label: 'Formazioni' }]} value={tab} onChange={setTab} />
      {tab === 'cronaca' ? (
        m.events?.length ? (
          <Card style={{ paddingHorizontal: 14, marginTop: space.s }}>
            {m.events.map((e, i) => (
              <Pressable key={i} style={[st.ev, i > 0 && st.evBorder]} onPress={() => e.playerId && router.push(`/giocatore/${e.playerId}`)}>
                <Text style={st.evMin}>{e.minute}</Text>
                <Text style={{ fontSize: 14 }}>{e.type === 'goal' ? '⚽' : e.type === 'yellow' ? '🟨' : '🟥'}</Text>
                <Text style={st.evText}>{e.text} ({teams[e.teamId]?.short})</Text>
              </Pressable>
            ))}
          </Card>
        ) : <Empty text="La cronaca comparirà con l'inizio della partita." />
      ) : (
        <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.s }}>
          {[homeP.value ?? [], awayP.value ?? []].map((list, k) => (
            <Card key={k} style={{ flex: 1, padding: 10 }}>
              <Text style={[type.label, { color: colors.lime, marginBottom: 6 }]}>{(k ? a : h)?.short}</Text>
              {list.map((p) => (
                <Pressable key={p.id} onPress={() => router.push(`/giocatore/${p.id}`)} style={{ flexDirection: 'row', gap: 6, paddingVertical: 4 }}>
                  <Text style={{ color: colors.muted, width: 20, fontWeight: '800', fontSize: 12 }}>{p.number}</Text>
                  <Text style={{ color: colors.ink, fontSize: 12, flex: 1 }} numberOfLines={1}>{p.name}</Text>
                </Pressable>
              ))}
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: colors.bluElettrico, borderRadius: 20, padding: space.l },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginVertical: space.m },
  team: { flex: 1, alignItems: 'center', gap: 6 },
  teamName: { color: colors.white, fontSize: 13, fontWeight: '700' },
  score: { color: colors.white, fontSize: 46, fontWeight: '900', paddingHorizontal: 6 },
  venue: { color: colors.white, opacity: 0.75, fontSize: 12, textAlign: 'center', marginTop: 8 },
  ev: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  evBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  evMin: { color: colors.muted, fontSize: 11, fontWeight: '700', width: 48 },
  pickOn: { backgroundColor: colors.lime },
  hint: { color: colors.muted, fontSize: 12, marginTop: space.s },
  mv: { backgroundColor: colors.card2, borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10, maxWidth: '48%' },
  mvT: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  evText: { color: colors.ink, fontSize: 13, flex: 1 },
});
