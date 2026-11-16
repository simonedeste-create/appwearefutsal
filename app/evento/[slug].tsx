// Modulo evento: la "app nell'app". Ogni evento sceglie i moduli da mostrare (programma, sedi,
// biglietti, info, news) e porta i suoi colori dentro la cornice We are futsal.
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../../src/components/MatchCard';
import { Card, Chips, Empty, Loading, PillButton, Screen, openUrl } from '../../src/components/ui';
import { data } from '../../src/data/source';
import type { EventModuleKey } from '../../src/data/types';
import { useData } from '../../src/data/useData';
import { colors, space, type } from '../../src/theme';

const LABELS: Record<EventModuleKey, string> = { programma: 'Programma', sedi: 'Sedi', biglietti: 'Biglietti', info: 'Info', news: 'News' };

export default function Evento() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const ev = useData(() => data.event(String(slug)), [slug]);
  const news = useData(() => data.news());
  const [tab, setTab] = useState<EventModuleKey | undefined>(undefined);
  if (ev.loading) return <Screen back title="Evento"><Loading /></Screen>;
  const e = ev.value;
  if (!e) return <Screen back title="Evento"><Empty text="Evento non trovato" /></Screen>;
  const current = tab ?? e.modules[0];
  const teamMap = Object.fromEntries(e.teams.map((t) => [t.id, t]));

  return (
    <Screen back title={e.title}>
      <View style={[st.hero, { backgroundColor: e.theme.primary }]}>
        <Text style={[type.label, { color: e.theme.accent }]}>{e.kicker}</Text>
        <Text style={st.title}>{e.title}</Text>
        <Text style={st.sub}>{e.subtitle} · {e.dates}</Text>
      </View>
      <Chips items={e.modules.map((m) => ({ id: m, label: LABELS[m] }))} value={current} onChange={setTab} />

      {current === 'programma' ? (
        e.matches.length ? e.matches.map((m) => <MatchCard key={m.id} match={m} home={teamMap[m.homeId]} away={teamMap[m.awayId]} />)
          : <Empty text="Il programma delle gare sarà pubblicato qui appena ufficiale, con risultati in tempo reale e link FUTSAL TV." />
      ) : null}

      {current === 'sedi' ? e.venues.map((v) => (
        <Card key={v.name} style={st.venue}>
          <View style={{ flex: 1 }}><Text style={st.vCity}>{v.city}</Text><Text style={st.vName}>{v.name}</Text></View>
          <Pressable onPress={() => openUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.mapsQuery)}`)} accessibilityRole="link">
            <Text style={{ color: colors.lime, fontWeight: '700', fontSize: 12 }}>Mappa ›</Text>
          </Pressable>
        </Card>
      )) : null}

      {current === 'biglietti' ? (
        <View style={[st.hero, { backgroundColor: colors.card, marginTop: space.s }]}>
          <Text style={[type.label, { color: e.theme.accent }]}>Biglietteria ufficiale</Text>
          <Text style={[st.title, { fontSize: 20 }]}>Tutte le gare dell'evento</Text>
          {e.ticketUrl ? <PillButton label="Acquista i biglietti" icon="ticket-outline" onPress={() => openUrl(e.ticketUrl)} /> : <Text style={st.sub}>Biglietteria non ancora aperta</Text>}
        </View>
      ) : null}

      {current === 'info' ? <Card style={{ padding: space.l, marginTop: space.s }}><Text style={{ color: colors.ink, fontSize: 15, lineHeight: 22 }}>{e.info}</Text></Card> : null}

      {current === 'news' ? (news.value ?? []).map((n) => (
        <Card key={n.id} style={{ padding: 14, marginBottom: 9 }}>
          <Text style={[type.label, { color: colors.lime }]}>{n.tag}</Text>
          <Text style={{ color: colors.ink, fontWeight: '700', marginTop: 3 }}>{n.title}</Text>
        </Card>
      )) : null}

      {e.webAppUrl ? <PillButton label="Apri la web app dell'evento" icon="open-outline" variant="ghost" onPress={() => openUrl(e.webAppUrl)} /> : null}
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { borderRadius: 20, padding: space.l, minHeight: 130, justifyContent: 'flex-end', gap: 4, marginBottom: space.m },
  title: { color: colors.white, fontSize: 24, fontWeight: '900', textTransform: 'uppercase' },
  sub: { color: colors.white, opacity: 0.85, fontSize: 12, fontWeight: '600' },
  venue: { flexDirection: 'row', alignItems: 'center', padding: 14, marginTop: space.s },
  vCity: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  vName: { color: colors.muted, fontSize: 12 },
});
