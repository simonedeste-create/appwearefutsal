import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Loading, PillButton, Screen, Section, openInApp } from '../src/components/ui';
import { data } from '../src/data/source';
import type { Partner } from '../src/data/types';
import { useData } from '../src/data/useData';
import { colors, radius, space, type } from '../src/theme';

const initials = (n: string) => n.replace(/[^A-Za-zÀ-ú ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

function PartnerRow({ p, first }: { p: Partner; first: boolean }) {
  return (
    <View style={[st.row, !first && { borderTopWidth: 1, borderTopColor: colors.line }]}>
      <View style={st.badge}><Text style={st.badgeT}>{initials(p.name)}</Text></View>
      <View style={{ flex: 1 }}>
        <Text style={st.name}>{p.name}</Text>
        {p.role ? <Text style={st.role}>{p.role}</Text> : null}
        {p.offer ? <Text style={st.offer}>{p.offer}</Text> : null}
      </View>
      {p.url ? <PillButton label="Vai" variant="ghost" onPress={() => openInApp(p.url)} /> : null}
    </View>
  );
}

export default function PartnerScreen() {
  const list = useData(() => data.partners());
  const all = list.value ?? [];
  return (
    <Screen back title="I nostri partner">
      <Text style={st.intro}>Le aziende e le istituzioni che sostengono la Divisione Calcio a 5 e i suoi campionati.</Text>
      {list.loading ? <Loading /> : null}
      <Section title="Partner principali" />
      <Card style={{ paddingHorizontal: 14 }}>{all.filter((p) => p.tier === 'principale').map((p, i) => <PartnerRow key={p.id} p={p} first={i === 0} />)}</Card>
      <Section title="Partner secondari" />
      <Card style={{ paddingHorizontal: 14 }}>{all.filter((p) => p.tier === 'secondario').map((p, i) => <PartnerRow key={p.id} p={p} first={i === 0} />)}</Card>
      <Text style={[type.small, { color: colors.muted, marginTop: space.m }]}>Offerte e vantaggi riservati alla community compariranno qui accanto a ogni partner.</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  intro: { color: colors.muted, fontSize: 13, marginBottom: space.s },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  badge: { width: 40, height: 40, borderRadius: radius.m, backgroundColor: colors.card2, alignItems: 'center', justifyContent: 'center' },
  badgeT: { color: colors.oro, fontWeight: '900', fontSize: 13 },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  role: { color: colors.muted, fontSize: 12, marginTop: 1 },
  offer: { color: colors.lime, fontSize: 12, fontWeight: '700', marginTop: 2 },
});
