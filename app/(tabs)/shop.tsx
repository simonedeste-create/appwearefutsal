import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Chips, IconButton, PillButton, Screen, openInApp } from '../../src/components/ui';
import { euro, useCart } from '../../src/cart';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function Shop() {
  const products = useData(() => data.products());
  const { count } = useCart();
  const [cat, setCat] = useState('Tutto');
  const cats = ['Tutto', ...Array.from(new Set((products.value ?? []).map((p) => p.category)))];
  const list = (products.value ?? []).filter((p) => cat === 'Tutto' || p.category === cat);
  return (
    <Screen title="Shop" right={<IconButton name="cart-outline" label={`Carrello, ${count} articoli`} onPress={() => router.push('/carrello')} />}>
      <View style={st.hero}>
        <Text style={[type.label, { color: colors.oro }]}>Shop ufficiale Divisione Calcio a 5</Text>
        <Text style={st.heroTitle}>#WeAreFutsal collection</Text>
        <PillButton label={count ? `Vai al carrello (${count})` : 'Apri lo shop completo'} variant="oro" onPress={() => (count ? router.push('/carrello') : openInApp(config.shopUrl))} />
      </View>
      <Chips items={cats.map((c) => ({ id: c, label: c }))} value={cat} onChange={setCat} />
      <View style={st.grid}>
        {list.map((p) => (
          <Pressable key={p.id} style={st.prod} onPress={() => router.push(`/prodotto/${p.id}`)} accessibilityRole="button">
            <View style={st.img}><Text style={{ fontSize: 44 }}>{p.emoji}</Text></View>
            <Text style={st.name}>{p.name}</Text>
            <Text style={st.price}>{euro(p.priceCents)}</Text>
          </Pressable>
        ))}
      </View>
      <Card style={{ padding: 14 }}>
        <Text style={{ color: colors.ink, fontSize: 12.5 }}>Paghi in sicurezza sullo shop ufficiale shop.divisionecalcioa5.it, aperto dentro l'app. Resi e condizioni sono quelli dello shop.</Text>
        <Pressable onPress={() => openInApp(config.shopReturnUrl)} style={{ marginTop: space.s }}><Text style={{ color: colors.oro, fontWeight: '800', fontSize: 12 }}>Politica di reso ›</Text></Pressable>
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
  price: { color: colors.oro, fontSize: 13, fontWeight: '800', marginTop: 3 },
});
