import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Empty, IconButton, Loading, Screen, Section } from '../../src/components/ui';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function Giocatore() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const player = useData(() => data.player(String(id)), [id]);
  const team = useData(() => (player.value ? data.team(player.value.teamId) : Promise.resolve(undefined)), [player.value]);
  if (player.loading) return <Screen back title="Giocatore"><Loading /></Screen>;
  const p = player.value;
  if (!p) return <Screen back title="Giocatore"><Empty text="Giocatore non trovato" /></Screen>;
  const s = p.stats;
  const tiles: [string, string][] = [
    [String(s.apps), 'Presenze'], [String(s.goals), 'Gol'], [String(s.assists), 'Assist'],
    [String(s.shotsOnTarget ?? '–'), 'Tiri in porta'], [s.minutes ? (s.goals / s.minutes * 40).toFixed(2).replace('.', ',') : '–', "Gol ogni 40'"], [`${s.minutes}'`, 'Minuti'],
  ];
  return (
    <Screen back title="Giocatore" right={<IconButton name="star-outline" label="Segui il giocatore" />}>
      <View style={st.hero}>
        <View style={st.photo}>
          {p.photoUrl ? <Image source={{ uri: p.photoUrl }} style={StyleSheet.absoluteFill} /> : <View style={st.silhouette} />}
          <Text style={st.num}>{p.number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Pressable onPress={() => team.value && router.push(`/squadra/${team.value.id}`)}>
            <Text style={[type.label, { color: colors.muted }]}>{team.value?.name} · {p.role}</Text>
          </Pressable>
          <Text style={st.name}>{p.name}</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Classe {p.birthYear} · {p.nationality}</Text>
        </View>
      </View>
      <View style={st.tiles}>
        {tiles.map(([v, l]) => (
          <Card key={l} style={st.tile}><Text style={st.tileV}>{v}</Text><Text style={st.tileL}>{l}</Text></Card>
        ))}
      </View>
      {s.veo ? (
        <>
          <Section title="Dati VEO" />
          <Card style={{ padding: 14 }}>
            {([['Precisione tiro', s.veo.shotAccuracy], ['Duelli vinti', s.veo.duelsWon], ['Recuperi', s.veo.recoveries]] as [string, number][]).map(([l, v]) => (
              <View key={l} style={{ marginVertical: 5 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.ink, fontSize: 13 }}>{l}</Text><Text style={{ color: colors.ink, fontWeight: '800' }}>{v}%</Text>
                </View>
                <View style={st.bar}><View style={[st.barFill, { width: `${v}%` }]} /></View>
              </View>
            ))}
          </Card>
        </>
      ) : null}
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: colors.bluElettrico, borderRadius: 20, padding: space.l, flexDirection: 'row', alignItems: 'center', gap: 14 },
  photo: { width: 96, height: 120, borderRadius: 16, backgroundColor: colors.reflexBlue, overflow: 'hidden', justifyContent: 'flex-end' },
  silhouette: { position: 'absolute', left: 18, right: 18, top: 22, bottom: 0, borderTopLeftRadius: 60, borderTopRightRadius: 60, backgroundColor: 'rgba(201,209,255,0.35)' },
  num: { color: colors.white, fontSize: 28, fontWeight: '900', marginLeft: 6 },
  name: { color: colors.white, fontSize: 24, fontWeight: '900', textTransform: 'uppercase', marginVertical: 4 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: space.m },
  tile: { width: '31.5%', padding: 10, alignItems: 'center' },
  tileV: { color: colors.lime, fontSize: 24, fontWeight: '900' },
  tileL: { color: colors.muted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', textAlign: 'center' },
  bar: { height: 6, borderRadius: 3, backgroundColor: colors.line, marginTop: 5, overflow: 'hidden' },
  barFill: { height: 6, backgroundColor: colors.lime },
});
