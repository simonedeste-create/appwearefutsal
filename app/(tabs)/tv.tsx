// FUTSAL TV: diretta in corso, palinsesto con "Ricordamelo", video on demand filtrabili
// per tipo e campionato, canale YouTube della Divisione e social.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fmtDay, fmtTime } from '../../src/components/MatchCard';
import { BroadcastBadge, Card, Chips, Empty, LiveBadge, PillButton, Screen, Section, SocialLinks, useWatch } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import type { Video } from '../../src/data/types';
import { useData } from '../../src/data/useData';
import { useReminders } from '../../src/reminders';
import { colors, radius, space, type } from '../../src/theme';

type Vod = 'highlight' | 'replay' | 'rubrica';
const KINDS: { id: 'tutti' | Vod; label: string }[] = [
  { id: 'tutti', label: 'Tutti' }, { id: 'highlight', label: 'Highlights' }, { id: 'replay', label: 'Gare integrali' }, { id: 'rubrica', label: 'Rubriche' },
];
const COMPS: { id: 'tutte' | string; label: string; color?: string }[] = [
  { id: 'tutte', label: 'Tutti i campionati' }, { id: 'serie-a', label: 'Serie A' }, { id: 'serie-a-f', label: 'Serie A Femminile', color: colors.rosa },
];

function VideoTile({ v, onPress }: { v: Video; onPress: () => void }) {
  return (
    <Pressable style={st.tile} onPress={onPress} accessibilityRole="link" accessibilityLabel={`Guarda ${v.title} su ${v.channel}`}>
      <View style={[st.thumb, { backgroundColor: v.competitionId === 'serie-a-f' ? colors.liveTile : colors.card2 }]}>
        <View style={st.play}><Ionicons name="play" size={16} color={colors.white} /></View>
        {v.duration ? <Text style={st.dur}>{v.duration}</Text> : null}
        <View style={{ position: 'absolute', left: 6, top: 6 }}><BroadcastBadge channel={v.channel} /></View>
      </View>
      <Text style={st.vTitle} numberOfLines={2}>{v.title}</Text>
      {v.subtitle ? <Text style={st.vSub} numberOfLines={1}>{v.subtitle}</Text> : null}
    </Pressable>
  );
}

export default function Tv() {
  const watch = useWatch();
  const reminders = useReminders();
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('tutti');
  const [comp, setComp] = useState<string>('tutte');
  const videos = useData(() => data.videos());
  if (videos.loading) return <Screen title="FUTSAL TV"><Empty text="Caricamento…" /></Screen>;

  const all = videos.value ?? [];
  const live = all.filter((v) => v.kind === 'live');
  const upcoming = all.filter((v) => v.kind === 'upcoming').slice(0, 5);
  const vod = all.filter((v) => v.kind !== 'live' && v.kind !== 'upcoming')
    .filter((v) => kind === 'tutti' || v.kind === kind)
    .filter((v) => comp === 'tutte' || v.competitionId === comp);

  return (
    <Screen title="FUTSAL TV">
      {live.length ? live.map((v) => (
        <View key={v.id} style={st.hero}>
          <View style={{ flexDirection: 'row', gap: space.s, alignItems: 'center' }}><LiveBadge /><BroadcastBadge channel={v.channel} /></View>
          <Text style={[type.label, { color: colors.muted, marginTop: space.m }]}>{v.subtitle}</Text>
          <Text style={st.heroTitle}>{v.title}</Text>
          <View style={{ flexDirection: 'row', gap: space.s }}>
            <PillButton label="Guarda ora" icon="play" variant="live" onPress={() => watch(v.url)} />
            {v.matchId ? <PillButton label="Match center" icon="stats-chart" variant="ghost" onPress={() => router.push(`/partita/${v.matchId}`)} /> : null}
          </View>
        </View>
      )) : (
        <Card style={{ padding: space.l, marginBottom: space.m }}>
          <Text style={{ color: colors.ink, fontWeight: '800' }}>Nessuna diretta in questo momento</Text>
          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Guarda il palinsesto qui sotto e attiva il promemoria.</Text>
        </Card>
      )}

      <Section title="Prossime dirette" />
      {upcoming.length ? (
        <Card style={{ paddingHorizontal: 14 }}>
          {upcoming.map((v, i) => {
            const on = reminders.has(v.id);
            return (
              <View key={v.id} style={[st.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
                <View style={st.when}>
                  <Text style={st.whenDay}>{v.startsAt ? fmtDay(v.startsAt) : ''}</Text>
                  <Text style={st.whenTime}>{v.startsAt ? fmtTime(v.startsAt) : ''}</Text>
                </View>
                <Pressable style={{ flex: 1 }} onPress={() => v.matchId && router.push(`/partita/${v.matchId}`)}>
                  <Text style={st.rowTitle} numberOfLines={1}>{v.title}</Text>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', marginTop: 3 }}>
                    <BroadcastBadge channel={v.channel} /><Text style={st.vSub} numberOfLines={1}>{v.subtitle}</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => reminders.toggle(v.id)} hitSlop={8} accessibilityRole="switch" accessibilityState={{ checked: on }} accessibilityLabel={on ? 'Togli promemoria' : 'Ricordamelo'} style={[st.bell, on && { backgroundColor: colors.lime, borderColor: colors.lime }]}>
                  <Ionicons name={on ? 'notifications' : 'notifications-outline'} size={16} color={on ? colors.onLime : colors.ink} />
                </Pressable>
              </View>
            );
          })}
        </Card>
      ) : <Empty text="Il palinsesto sarà pubblicato a breve." />}

      <Section title="On demand" />
      <Chips items={KINDS} value={kind} onChange={setKind} />
      <Chips items={COMPS} value={comp} onChange={setComp} />
      {vod.length ? <View style={st.grid}>{vod.map((v) => <VideoTile key={v.id} v={v} onPress={() => watch(v.url)} />)}</View> : <Empty text="Nessun video per questi filtri." />}

      <Section title="Tutto il futsal in video" />
      <View style={{ flexDirection: 'row', gap: space.s, marginBottom: space.l }}>
        <Pressable style={[st.channel, { borderColor: colors.live }]} onPress={() => watch(config.futsalTv.url)} accessibilityRole="link">
          <Text style={st.channelName}>FUTSAL<Text style={{ color: colors.live }}>TV</Text></Text>
          <Text style={st.vSub}>Dirette e archivio</Text>
        </Pressable>
        <Pressable style={[st.channel, { borderColor: colors.youtube }]} onPress={() => watch(config.futsalTv.youtubeUrl)} accessibilityRole="link">
          <Ionicons name="logo-youtube" size={22} color={colors.youtube} />
          <Text style={st.vSub}>Canale YouTube della Divisione</Text>
        </Pressable>
      </View>
      <Section title="Seguici" />
      <SocialLinks />
      <View style={{ height: space.xl }} />
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: colors.liveDeep, borderRadius: 20, padding: space.l, minHeight: 170, justifyContent: 'flex-end', marginBottom: space.m },
  heroTitle: { color: colors.white, fontSize: 25, fontWeight: '900', textTransform: 'uppercase', marginVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  when: { width: 58 },
  whenDay: { color: colors.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  whenTime: { color: colors.white, fontSize: 18, fontWeight: '900' },
  rowTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  bell: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: space.l },
  tile: { width: '47%' },
  thumb: { height: 96, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  play: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  dur: { position: 'absolute', right: 8, bottom: 6, color: colors.white, fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, borderRadius: 4, overflow: 'hidden' },
  vTitle: { color: colors.ink, fontSize: 12.5, fontWeight: '600', marginTop: 6 },
  vSub: { color: colors.muted, fontSize: 11, flexShrink: 1 },
  channel: { flex: 1, backgroundColor: colors.card, borderRadius: radius.m, borderWidth: 1, padding: space.m, gap: 6, minHeight: 80, justifyContent: 'center' },
  channelName: { color: colors.white, fontSize: 18, fontWeight: '900' },
});
