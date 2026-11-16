import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chips, LiveBadge, PillButton, Screen, Section, openUrl } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import type { Video } from '../../src/data/types';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

const KINDS: { id: 'tutti' | Video['kind']; label: string }[] = [
  { id: 'tutti', label: 'Tutti' }, { id: 'live', label: 'Dirette' }, { id: 'highlight', label: 'Highlights' },
  { id: 'replay', label: 'Replay' }, { id: 'rubrica', label: 'Rubriche' },
];

function VideoTile({ v }: { v: Video }) {
  return (
    <Pressable style={st.tile} onPress={() => openUrl(v.url)} accessibilityRole="link" accessibilityLabel={`Guarda ${v.title} su FUTSAL TV`}>
      <View style={[st.thumb, { backgroundColor: v.kind === 'live' ? '#3A0A12' : colors.card2 }]}>
        <View style={st.play}><Ionicons name="play" size={16} color={colors.white} /></View>
        {v.kind === 'live' ? <View style={{ position: 'absolute', left: 8, top: 8 }}><LiveBadge /></View>
          : v.duration ? <Text style={st.dur}>{v.duration}</Text> : null}
      </View>
      <Text style={st.vTitle} numberOfLines={2}>{v.title}</Text>
    </Pressable>
  );
}

export default function Tv() {
  const [kind, setKind] = useState<(typeof KINDS)[number]['id']>('tutti');
  const videos = useData(() => data.videos());
  const all = videos.value ?? [];
  const live = all.filter((v) => v.kind === 'live');
  const list = kind === 'tutti' ? all : all.filter((v) => v.kind === kind);
  return (
    <Screen title="FUTSAL TV">
      {live[0] ? (
        <View style={st.hero}>
          <LiveBadge />
          <Text style={[type.label, { color: colors.muted, marginTop: space.m }]}>In diretta ora</Text>
          <Text style={st.heroTitle}>{live[0].title}</Text>
          <PillButton label="Guarda ora" icon="play" variant="live" onPress={() => openUrl(live[0].url)} />
        </View>
      ) : null}
      <Chips items={KINDS} value={kind} onChange={setKind} />
      <Section title={kind === 'tutti' ? 'Tutti i video' : KINDS.find((k) => k.id === kind)!.label} />
      <View style={st.grid}>{list.map((v) => <VideoTile key={v.id} v={v} />)}</View>
      <PillButton label="Apri futsaltv.it" icon="open-outline" variant="ghost" onPress={() => openUrl(config.futsalTvUrl)} />
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: '#2A0810', borderRadius: 20, padding: space.l, minHeight: 170, justifyContent: 'flex-end', marginBottom: space.m },
  heroTitle: { color: colors.white, fontSize: 25, fontWeight: '900', textTransform: 'uppercase', marginVertical: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: space.l },
  tile: { width: '47%' },
  thumb: { height: 96, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  play: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  dur: { position: 'absolute', right: 8, bottom: 6, color: colors.white, fontSize: 10, fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 5, borderRadius: 4, overflow: 'hidden' },
  vTitle: { color: colors.ink, fontSize: 12.5, fontWeight: '600', marginTop: 6 },
});
