import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, Crest, Empty, Screen, Section } from '../src/components/ui';
import { data } from '../src/data/source';
import { useData } from '../src/data/useData';
import { useTeamMap } from '../src/data/useTeams';
import { colors, radius, space, type } from '../src/theme';

export default function Cerca() {
  const [q, setQ] = useState('');
  const teams = useTeamMap();
  const res = useData(() => data.search(q), [q]);
  const r = res.value;
  const total = r ? r.teams.length + r.players.length + r.news.length + r.communiques.length : 0;
  return (
    <Screen back title="Cerca">
      <TextInput
        value={q} onChangeText={setQ} autoFocus returnKeyType="search" autoCorrect={false}
        placeholder="Squadre, giocatori, news, comunicati" placeholderTextColor={colors.muted}
        style={st.input} accessibilityLabel="Cerca nell'app"
      />
      {q.trim().length < 2 ? <Empty text="Scrivi almeno due lettere per cercare." /> : null}
      {q.trim().length >= 2 && r && total === 0 ? <Empty text="Nessun risultato." /> : null}
      {r?.teams.length ? <>
        <Section title="Squadre" />
        <Card>{r.teams.map((t, i) => (
          <Pressable key={t.id} onPress={() => router.push(`/squadra/${t.id}`)} style={[st.row, i > 0 && st.border]}>
            <Crest short={t.short} color={t.color} />
            <View style={{ flex: 1 }}><Text style={st.name}>{t.name}</Text><Text style={st.sub}>{t.city}</Text></View>
          </Pressable>
        ))}</Card>
      </> : null}
      {r?.players.length ? <>
        <Section title="Giocatori" />
        <Card>{r.players.map((p, i) => (
          <Pressable key={p.id} onPress={() => router.push(`/giocatore/${p.id}`)} style={[st.row, i > 0 && st.border]}>
            <Text style={st.num}>{p.number}</Text>
            <View style={{ flex: 1 }}><Text style={st.name}>{p.name}</Text><Text style={st.sub}>{teams[p.teamId]?.name} · {p.role}</Text></View>
          </Pressable>
        ))}</Card>
      </> : null}
      {r?.communiques.length ? <>
        <Section title="Comunicati ufficiali" />
        <Card>{r.communiques.map((c, i) => (
          <Pressable key={c.id} onPress={() => router.push('/comunicati')} style={[st.row, i > 0 && st.border]}>
            <View style={{ flex: 1 }}><Text style={[type.label, { color: colors.oro }]}>{c.kind}</Text><Text style={st.name}>{c.title}</Text></View>
          </Pressable>
        ))}</Card>
      </> : null}
      {r?.news.length ? <>
        <Section title="News" />
        <Card>{r.news.map((n, i) => (
          <Pressable key={n.id} onPress={() => router.push(`/news/${n.id}`)} style={[st.row, i > 0 && st.border]}>
            <View style={{ flex: 1 }}><Text style={[type.label, { color: colors.lime }]}>{n.tag}</Text><Text style={st.name}>{n.title}</Text></View>
          </Pressable>
        ))}</Card>
      </> : null}
    </Screen>
  );
}

const st = StyleSheet.create({
  input: { backgroundColor: colors.card, color: colors.ink, borderRadius: radius.m, borderWidth: 1, borderColor: colors.line, paddingHorizontal: space.l, paddingVertical: 12, fontSize: 15 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 11 },
  border: { borderTopWidth: 1, borderTopColor: colors.line },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  sub: { color: colors.muted, fontSize: 12, marginTop: 1 },
  num: { color: colors.lime, fontSize: 18, fontWeight: '900', width: 28, textAlign: 'center' },
});
