import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Loading, Screen } from '../../src/components/ui';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function Eventi() {
  const events = useData(() => data.events());
  return (
    <Screen title="Eventi">
      <Text style={st.intro}>Ogni grande evento ha la sua app dentro l’app: programma, risultati live, sedi, biglietti e news.</Text>
      {events.loading ? <Loading /> : (events.value ?? []).map((e) => (
        <Pressable key={e.slug} style={[st.card, { backgroundColor: e.theme.primary }]} onPress={() => router.push(`/evento/${e.slug}`)} accessibilityRole="button">
          <Text style={[type.label, { color: e.theme.accent }]}>{e.kicker}</Text>
          <Text style={st.title}>{e.title}</Text>
          <View style={st.foot}>
            <Text style={st.sub}>{e.dates}</Text>
            <View style={[st.open, { backgroundColor: e.theme.accent }]}><Text style={st.openText}>Apri ›</Text></View>
          </View>
        </Pressable>
      ))}
    </Screen>
  );
}

const st = StyleSheet.create({
  intro: { color: colors.muted, fontSize: 13, marginBottom: space.m, marginHorizontal: 2 },
  card: { borderRadius: 20, padding: space.l, minHeight: 128, justifyContent: 'flex-end', marginBottom: space.m - 2 },
  title: { color: colors.white, fontSize: 21, fontWeight: '900', textTransform: 'uppercase', marginVertical: 6 },
  foot: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sub: { color: colors.white, opacity: 0.85, fontSize: 12, fontWeight: '600' },
  open: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  openText: { color: colors.onLime, fontSize: 12, fontWeight: '800' },
});
