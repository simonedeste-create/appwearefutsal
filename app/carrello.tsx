import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Empty, PillButton, Screen, openInApp } from '../src/components/ui';
import { cart, euro, useCart } from '../src/cart';
import { config } from '../src/config';
import { data } from '../src/data/source';
import { useData } from '../src/data/useData';
import { shopBackend } from '../src/shop';
import { colors, space, type } from '../src/theme';

export default function Carrello() {
  const { lines } = useCart();
  const products = useData(() => data.products());
  const [busy, setBusy] = useState(false);
  const rows = lines.map((l) => ({ l, p: (products.value ?? []).find((x) => x.id === l.productId) })).filter((r) => r.p);
  const total = rows.reduce((n, r) => n + (r.p?.priceCents ?? 0) * r.l.qty, 0);
  const pay = () => {
    setBusy(true);
    shopBackend.checkout(lines).then((r) => openInApp(r.url)).catch(() => openInApp(config.shopUrl)).then(() => setBusy(false));
  };
  return (
    <Screen back title="Carrello">
      {rows.length === 0 ? (
        <>
          <Empty text="Il carrello è vuoto" />
          <PillButton label="Vai allo Shop" variant="oro" onPress={() => router.push('/shop')} />
        </>
      ) : (
        <>
          <Card style={{ paddingHorizontal: 14 }}>
            {rows.map(({ l, p }, i) => (
              <View key={`${l.productId}-${l.size ?? ''}`} style={[st.row, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
                <Text style={{ fontSize: 30 }}>{p?.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={st.name}>{p?.name}</Text>
                  <Text style={st.sub}>{l.size ? `Taglia ${l.size} · ` : ''}{euro(p?.priceCents ?? 0)}</Text>
                </View>
                <View style={st.qty}>
                  <Pressable onPress={() => cart.setQty(l, l.qty - 1)} accessibilityLabel="Meno" hitSlop={8}><Text style={st.qBtn}>−</Text></Pressable>
                  <Text style={st.qNum}>{l.qty}</Text>
                  <Pressable onPress={() => cart.setQty(l, Math.min(9, l.qty + 1))} accessibilityLabel="Più" hitSlop={8}><Text style={st.qBtn}>+</Text></Pressable>
                </View>
              </View>
            ))}
          </Card>
          <View style={st.total}>
            <Text style={[type.label, { color: colors.muted }]}>Totale prodotti</Text>
            <Text style={st.totalV}>{euro(total)}</Text>
          </View>
          <Text style={st.note}>Spedizione e pagamento si completano sullo shop ufficiale della Divisione, aperto dentro l'app.</Text>
          <PillButton label={busy ? 'Apro lo shop…' : 'Acquista'} icon="lock-closed-outline" variant="oro" onPress={pay} />
          <Pressable onPress={() => cart.clear()} style={{ alignSelf: 'center', padding: space.m }} accessibilityRole="button"><Text style={{ color: colors.muted, fontWeight: '700' }}>Svuota il carrello</Text></Pressable>
        </>
      )}
    </Screen>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  sub: { color: colors.muted, fontSize: 12, marginTop: 2 },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qBtn: { color: colors.lime, fontSize: 22, fontWeight: '900' },
  qNum: { color: colors.ink, fontSize: 15, fontWeight: '800', minWidth: 16, textAlign: 'center' },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: space.m },
  totalV: { color: colors.oro, fontSize: 24, fontWeight: '900' },
  note: { color: colors.muted, fontSize: 12, marginBottom: space.m },
});
