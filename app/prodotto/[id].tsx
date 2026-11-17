import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Empty, IconButton, Loading, PillButton, Screen } from '../../src/components/ui';
import { cart, euro, useCart } from '../../src/cart';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

export default function Prodotto() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useData(() => data.product(String(id)), [id]);
  const { count } = useCart();
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const right = <IconButton name="cart-outline" label={`Carrello, ${count} articoli`} onPress={() => router.push('/carrello')} />;
  if (product.loading) return <Screen back title="Prodotto"><Loading /></Screen>;
  const p = product.value;
  if (!p) return <Screen back title="Prodotto"><Empty text="Prodotto non trovato" /></Screen>;
  const needSize = !!p.sizes?.length && !size;
  return (
    <Screen back title="Prodotto" right={right}>
      <View style={st.img}><Text style={{ fontSize: 96 }}>{p.emoji}</Text></View>
      <Text style={[type.label, { color: colors.oro, marginTop: space.m }]}>{p.category}</Text>
      <Text style={st.name}>{p.name}</Text>
      <Text style={st.price}>{euro(p.priceCents)}</Text>
      <Text style={st.desc}>{p.description}</Text>
      {p.sizes?.length ? (
        <>
          <Text style={[type.label, { color: colors.muted, marginTop: space.l }]}>Taglia</Text>
          <View style={st.sizes}>
            {p.sizes.map((z) => (
              <Pressable key={z} onPress={() => setSize(z)} accessibilityRole="button" accessibilityState={{ selected: size === z }} style={[st.size, size === z && st.sizeOn]}>
                <Text style={[st.sizeT, size === z && { color: colors.onLime }]}>{z}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : null}
      <View style={st.qtyRow}>
        <Text style={[type.label, { color: colors.muted }]}>Quantità</Text>
        <View style={st.qty}>
          <Pressable onPress={() => setQty(Math.max(1, qty - 1))} accessibilityLabel="Meno" hitSlop={8}><Text style={st.qBtn}>−</Text></Pressable>
          <Text style={st.qNum}>{qty}</Text>
          <Pressable onPress={() => setQty(Math.min(9, qty + 1))} accessibilityLabel="Più" hitSlop={8}><Text style={st.qBtn}>+</Text></Pressable>
        </View>
      </View>
      <View style={{ marginTop: space.l, gap: space.s }}>
        <PillButton label={needSize ? 'Scegli la taglia' : `Aggiungi al carrello · ${euro(p.priceCents * qty)}`} icon="cart-outline" variant="oro"
          onPress={() => { if (needSize) return; cart.add({ productId: p.id, size, qty }); setAdded(true); }} />
        {added ? <PillButton label="Vai al carrello" variant="ghost" onPress={() => router.push('/carrello')} /> : null}
      </View>
      <Card style={{ padding: 14, marginTop: space.l }}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>Il pagamento si completa sullo shop ufficiale della Divisione.</Text>
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  img: { height: 220, borderRadius: 20, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.ink, fontSize: 24, fontWeight: '900', textTransform: 'uppercase', marginTop: 4 },
  price: { color: colors.oro, fontSize: 20, fontWeight: '900', marginTop: 4 },
  desc: { color: colors.muted, fontSize: 14, marginTop: space.s },
  sizes: { flexDirection: 'row', gap: space.s, marginTop: space.s },
  size: { minWidth: 46, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.card, alignItems: 'center', borderWidth: 1, borderColor: colors.line },
  sizeOn: { backgroundColor: colors.lime, borderColor: colors.lime },
  sizeT: { color: colors.ink, fontWeight: '800' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.l },
  qty: { flexDirection: 'row', alignItems: 'center', gap: space.l, backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: space.l, paddingVertical: 6 },
  qBtn: { color: colors.lime, fontSize: 24, fontWeight: '900' },
  qNum: { color: colors.ink, fontSize: 18, fontWeight: '800', minWidth: 20, textAlign: 'center' },
});
