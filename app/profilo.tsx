// "Il mio futsal": dati dell'account, fan card, squadre seguite, notifiche, consensi,
// uscita ed eliminazione dell'account (obbligatoria per l'App Store, linea guida 5.1.1(v)).
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth } from '../src/auth/AuthContext';
import { Card, Crest, PillButton, Screen, Section, SocialLinks, openUrl } from '../src/components/ui';
import { config } from '../src/config';
import { data } from '../src/data/source';
import { useData } from '../src/data/useData';
import { colors, space, type } from '../src/theme';

const PREFS = [
  { id: 'start', label: 'Inizio partita e gol' },
  { id: 'final', label: 'Risultati finali' },
  { id: 'tv', label: 'Dirette FUTSAL TV' },
  { id: 'shop', label: 'Offerte dello Shop' },
] as const;

function Row({ label, value, onChange, first }: { label: string; value: boolean; onChange: (v: boolean) => void; first?: boolean }) {
  return (
    <View style={[st.pref, !first && { borderTopWidth: 1, borderTopColor: colors.line }]}>
      <Text style={{ color: colors.ink, fontSize: 13, flex: 1, paddingRight: 10 }}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.lime, false: colors.line }} thumbColor={colors.white} />
    </View>
  );
}

export default function Profilo() {
  const { user, signOut, deleteAccount, updateProfile } = useAuth();
  const teams = useData(() => data.teams());
  const [prefs, setPrefs] = useState<Record<string, boolean>>({ start: true, final: true, tv: true, shop: false });
  const all = teams.value ?? [];
  const followed = user?.favoriteTeamIds.length ? all.filter((t) => user.favoriteTeamIds.includes(t.id)) : [];

  if (!user) {
    // Solo con authMode 'video' o 'optional': l'area personale chiede comunque l'accesso.
    return (
      <Screen back title="Il mio futsal">
        <Card style={{ padding: space.l, gap: space.m }}>
          <Text style={st.name}>Accedi o registrati</Text>
          <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }}>Con l’account guardi FUTSAL TV, segui le tue squadre, ricevi le notifiche e attivi la fan card.</Text>
          <PillButton label="Accedi" icon="log-in-outline" onPress={() => router.push('/accesso')} />
          <PillButton label="Crea un account" variant="ghost" onPress={() => router.push('/registrazione')} />
        </Card>
      </Screen>
    );
  }

  const toggleTeam = (id: string) => {
    const ids = user.favoriteTeamIds.includes(id) ? user.favoriteTeamIds.filter((x) => x !== id) : [...user.favoriteTeamIds, id];
    updateProfile({ favoriteTeamIds: ids }).catch(() => undefined);
  };

  const confirmDelete = () => Alert.alert(
    'Eliminare l’account?',
    'Cancelliamo il tuo profilo, le squadre seguite, i punti della fan card e i consensi. L’operazione non si può annullare.',
    [{ text: 'Annulla', style: 'cancel' }, { text: 'Elimina', style: 'destructive', onPress: () => { deleteAccount().catch(() => undefined); } }],
  );

  return (
    <Screen back title="Il mio futsal">
      <View style={st.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Image source={require('../assets/logo-lnd-calcio-a-5-bianco.png')} style={{ width: 40, height: 26 }} resizeMode="contain" />
          <Text style={[type.label, { color: colors.lime }]}>Fan card</Text>
        </View>
        <View>
          <Text style={st.name}>{user.firstName} {user.lastName}</Text>
          <Text style={{ color: colors.white, opacity: 0.85, fontSize: 12 }}>{user.email} · iscritto dal {new Date(user.createdAt).toLocaleDateString('it-IT')}</Text>
          <Text style={{ color: colors.white, opacity: 0.85, fontSize: 12, marginTop: 4 }}>0 punti · presenze al palazzetto, visioni e acquisti</Text>
        </View>
      </View>

      <Section title="Le mie squadre" />
      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: space.s }}>Tocca per seguire o smettere di seguire.</Text>
      <View style={st.teams}>
        {all.map((t) => {
          const on = followed.some((f) => f.id === t.id);
          return (
            <Pressable key={t.id} onPress={() => toggleTeam(t.id)} style={[st.team, on && { borderColor: colors.lime }]} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={t.name}>
              <Crest short={t.short} color={t.color} size={26} />
              <Text style={{ color: on ? colors.lime : colors.ink, fontSize: 11, fontWeight: '700' }} numberOfLines={1}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>

      <Section title="Notifiche" />
      <Card style={{ paddingHorizontal: 14 }}>
        {PREFS.map((p, i) => <Row key={p.id} first={i === 0} label={p.label} value={!!prefs[p.id]} onChange={(v: boolean) => setPrefs((x) => ({ ...x, [p.id]: v }))} />)}
      </Card>

      <Section title="Privacy e consensi" />
      <Card style={{ paddingHorizontal: 14 }}>
        <Row first label="News, Shop ed eventi della Divisione" value={user.consents.marketing} onChange={(v: boolean) => { updateProfile({ marketing: v }).catch(() => undefined); }} />
        <Row label="Comunicazioni dei partner" value={user.consents.partners} onChange={(v: boolean) => { updateProfile({ partners: v }).catch(() => undefined); }} />
      </Card>
      <View style={{ flexDirection: 'row', gap: space.l, marginTop: space.s }}>
        <Pressable onPress={() => openUrl(config.privacyUrl)}><Text style={st.link}>Informativa privacy</Text></Pressable>
        <Pressable onPress={() => openUrl(config.termsUrl)}><Text style={st.link}>Termini d’uso</Text></Pressable>
      </View>

      <Section title="Seguici" />
      <SocialLinks />

      <View style={{ marginTop: space.xl, gap: space.s }}>
        <PillButton label="Esci" icon="log-out-outline" variant="ghost" onPress={() => { signOut().catch(() => undefined); }} />
        <Pressable onPress={confirmDelete} style={{ alignSelf: 'center', padding: space.m }} accessibilityRole="button">
          <Text style={{ color: colors.live, fontWeight: '800' }}>Elimina account</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  card: { backgroundColor: colors.reflexBlue, borderRadius: 20, padding: space.l, minHeight: 160, justifyContent: 'space-between', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  name: { color: colors.white, fontSize: 20, fontWeight: '900', textTransform: 'uppercase', marginTop: space.l },
  pref: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  teams: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  team: { width: '31%', alignItems: 'center', gap: 5, paddingVertical: 10, backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.line },
  link: { color: colors.lime, fontSize: 12, fontWeight: '700' },
});
