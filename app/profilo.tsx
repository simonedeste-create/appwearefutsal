// "Il mio futsal": squadre seguite, preferenze di notifica e fan card.
// Le preferenze restano sul dispositivo finché non c'è il backend con account e notifiche push.
import React, { useState } from 'react';
import { Image, StyleSheet, Switch, Text, View } from 'react-native';
import { Card, Crest, Screen, Section } from '../src/components/ui';
import { data } from '../src/data/source';
import { useData } from '../src/data/useData';
import { colors, space, type } from '../src/theme';

const PREFS = [
  { id: 'start', label: 'Inizio partita e gol' },
  { id: 'final', label: 'Risultati finali' },
  { id: 'tv', label: 'Dirette FUTSAL TV' },
  { id: 'shop', label: 'Offerte dello Shop' },
] as const;

export default function Profilo() {
  const teams = useData(() => data.teams());
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ start: true, final: true, tv: true, shop: false });
  const followed = (teams.value ?? []).slice(0, 4);
  return (
    <Screen back title="Il mio futsal">
      <View style={st.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={require('../assets/logo-lnd-calcio-a-5-bianco.png')} style={{ width: 40, height: 26 }} resizeMode="contain" />
          <Text style={[type.label, { color: colors.lime }]}>Fan card</Text>
        </View>
        <Text style={st.name}>Accedi per attivare la tua fan card</Text>
        <Text style={{ color: colors.white, opacity: 0.85, fontSize: 12 }}>Punti per presenze al palazzetto, visioni e acquisti</Text>
      </View>
      <Section title="Squadre seguite" />
      <View style={{ flexDirection: 'row', gap: space.s }}>
        {followed.map((t) => (
          <Card key={t.id} style={{ flex: 1, alignItems: 'center', paddingVertical: 10, gap: 5 }}>
            <Crest short={t.short} color={t.color} />
            <Text style={{ color: colors.ink, fontSize: 11, fontWeight: '600' }}>{t.name}</Text>
          </Card>
        ))}
      </View>
      <Section title="Notifiche" />
      <Card style={{ paddingHorizontal: 14 }}>
        {PREFS.map((p, i) => (
          <View key={p.id} style={[st.pref, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
            <Text style={{ color: colors.ink, fontSize: 13 }}>{p.label}</Text>
            <Switch value={!!prefs[p.id]} onValueChange={(v: boolean) => setPrefs((x) => ({ ...x, [p.id]: v }))}
              trackColor={{ true: colors.lime, false: colors.line }} thumbColor={colors.white} />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: colors.reflexBlue, borderRadius: 20, padding: space.l, minHeight: 160, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  name: { color: colors.white, fontSize: 20, fontWeight: '900', textTransform: 'uppercase', marginTop: space.l },
  pref: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
});
