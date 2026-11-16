import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chips, PillButton, Screen, openUrl } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function Shop() {
  const products = useData(() => data.products());
  const [cat, setCat] = useState('Tutto');
  const cats = ['Tutto', ...Array.from(new Set((products.value ?? []).map((p) => p.category)))];
  const list = (products.value ?? []).filter((p) => cat === 'Tutto' || p.category === cat);
  return (
    <Screen title="Shop">
      <View style={st.hero}>
        <Text style={[type.label, { color: colors.oro }]}>Shop ufficiale Divisione Calcio a 5</Text>
        <Text style={st.heroTitle}>#WeAreFutsal collection</Text>
        <PillButton label="Accedi allo shop" variant="oro" onPress={() => openUrl(config.shopUrl)} />
      </View>
      <Chips items={cats.map((c) => ({ id: c, label: c }))} value={cat} onChange={setCat} />
      <View style={st.grid}>
        {list.map((p) => (
          <Pressable key={p.id} style={st.prod} onPress={() => openUrl(p.url)} accessibilityRole="link">
            <View style={st.img}><Text style={{ fontSize: 44 }}>{p.emoji}</Text></View>
            <Text style={st.name}>{p.name}</Text>
            <Text style={st.cta}>Scopri ›</Text>
          </Pressable>
        ))}
      </View>
      <Card style={{ padding: 14 }}>
        <Text style={{ color: colors.ink, fontSize: 12.5 }}><Text style={{ color: colors.lime, fontWeight: '800' }}>Vantaggio app: </Text>codici sconto riservati alla community registrata.</Text>
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { backgroundColor: colors.reflexBlue, borderRadius: 20, borderWidth: 1, borderColor: colors.oro, padding: space.l, minHeight: 140, justifyContent: 'flex-end', gap: 6, marginBottom: space.m },
  heroTitle: { color: colors.white, fontSize: 25, fontWeight: '900', textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginVertical: space.m },
  prod: { width: '48%', backgroundColor: colors.card, borderRadius: 18, padding: 10 },
  img: { height: 110, borderRadius: 12, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.ink, fontSize: 13, fontWeight: '600', marginTop: 8 },
  cta: { color: colors.oro, fontSize: 12, fontWeight: '800', marginTop: 3 },
});
