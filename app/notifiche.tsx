import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { Card, Chips, PillButton, Screen, Section } from '../src/components/ui';
import { LIVE_EVENTS, OTHER_EVENTS, PREVIEWS, Scope, useNotifPrefs } from '../src/notifications';
import { PushStatus, pushBackend, requestPush } from '../src/push';
import { colors, radius, space, type } from '../src/theme';

function Row({ label, hint, value, onChange, first }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void; first?: boolean }) {
  return (
    <View style={[st.row, !first && { borderTopWidth: 1, borderTopColor: colors.line }]}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={st.label}>{label}</Text>
        {hint ? <Text style={st.hint}>{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.lime, false: colors.line }} thumbColor={colors.white} accessibilityLabel={label} />
    </View>
  );
}

export default function Notifiche() {
  const { user } = useAuth();
  const n = useNotifPrefs();
  const [push, setPush] = useState<PushStatus>('unknown');
  const followed = user?.favoriteTeamIds ?? [];
  const enable = () => {
    requestPush().then((r) => {
      setPush(r.status);
      if (r.token) pushBackend.register(r.token, n.prefs, followed).catch(() => undefined);
    }).catch(() => undefined);
  };
  return (
    <Screen back title="Notifiche">
      <Card style={{ padding: 14 }}>
        <Text style={st.label}>Avvisi sul telefono</Text>
        <Text style={st.hint}>{push === 'granted' ? 'Attivi: riceverai gli avvisi scelti qui sotto.' : push === 'denied' ? 'Hai negato il permesso: puoi riattivarlo dalle impostazioni del telefono.' : 'Attiva il permesso per ricevere gol e risultati anche ad app chiusa.'}</Text>
        {push !== 'granted' ? <View style={{ marginTop: space.s }}><PillButton label="Attiva le notifiche" icon="notifications-outline" onPress={enable} /></View> : null}
      </Card>

      <Section title="Live score" />
      <Text style={st.hint}>Per quali partite vuoi gli avvisi live</Text>
      <Chips<Scope> items={[{ id: 'followed', label: 'Le mie squadre' }, { id: 'all', label: 'Tutte le partite' }]} value={n.prefs.scope} onChange={n.setScope} />
      {n.prefs.scope === 'followed' && followed.length === 0 ? (
        <Pressable onPress={() => router.push('/profilo')} accessibilityRole="button"><Text style={st.link}>Non segui ancora nessuna squadra: scegline qualcuna ›</Text></Pressable>
      ) : null}
      <Card style={{ paddingHorizontal: 14, marginTop: space.s }}>
        {LIVE_EVENTS.map((e, i) => <Row key={e.id} first={i === 0} label={e.label} hint={e.hint} value={n.prefs.events[e.id]} onChange={(v) => n.setEvent(e.id, v)} />)}
      </Card>
      <Text style={[st.hint, { marginTop: space.s }]}>Per una singola partita usa la campanella nel match center: avvisa su tutti gli eventi di quella gara.</Text>

      <Section title="Anteprima" />
      <View style={st.preview}>
        <Text style={st.pApp}>WE ARE FUTSAL · ora</Text>
        <Text style={st.pTitle}>{PREVIEWS.goal.title}</Text>
        <Text style={st.pBody}>{PREVIEWS.goal.body}</Text>
      </View>

      <Section title="Altro" />
      <Card style={{ paddingHorizontal: 14 }}>
        {OTHER_EVENTS.map((e, i) => <Row key={e.id} first={i === 0} label={e.label} value={n.prefs.events[e.id]} onChange={(v) => n.setEvent(e.id, v)} />)}
      </Card>
      <Text style={[type.small, { color: colors.muted, marginTop: space.m }]}>Gli avvisi sono sempre facoltativi e si possono disattivare in ogni momento.</Text>
    </Screen>
  );
}

const st = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 12, marginTop: 2 },
  link: { color: colors.lime, fontSize: 12.5, fontWeight: '700', marginVertical: space.xs },
  preview: { backgroundColor: colors.card2, borderRadius: radius.l, padding: 14, borderWidth: 1, borderColor: colors.line },
  pApp: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  pTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: 4 },
  pBody: { color: colors.muted, fontSize: 13, marginTop: 2 },
});
