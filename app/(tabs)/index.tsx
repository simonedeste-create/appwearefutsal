import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../../src/components/MatchCard';
import { Card, Crest, IconButton, PillButton, Screen, Section, SocialLinks, openUrl } from '../../src/components/ui';
import { config } from '../../src/config';
import { data } from '../../src/data/source';
import { useData } from '../../src/data/useData';
import { useTeamMap } from '../../src/data/useTeams';
import { colors, space, type } from '../../src/theme';

type IconName = keyof typeof Ionicons.glyphMap;

export default function Home() {
  const teams = useTeamMap();
  const live = useData(() => data.matches({ status: 'live' }));
  const events = useData(() => data.events());
  const news = useData(() => data.news());
  const comm = useData(() => data.communiques());
  const partners = useData(() => data.partners());
  const scorers = useData(() => data.topScorers('serie-a', 3));
  const featured = events.value?.[0];

  const quick: { label: string; icon: IconName; bg: string; fg?: string; onPress: () => void }[] = [
    { label: 'FUTSAL TV', icon: 'tv-outline', bg: colors.live, onPress: () => router.push('/tv') },
    { label: 'Shop', icon: 'bag-handle-outline', bg: colors.oro, fg: colors.onLime, onPress: () => router.push('/shop') },
    { label: 'Classifiche', icon: 'list-outline', bg: colors.electric, onPress: () => router.push('/partite') },
    { label: 'Femminile', icon: 'star-outline', bg: colors.rosa, onPress: () => router.push({ pathname: '/partite', params: { c: 'serie-a-f' } }) },
  ];

  return (
    <Screen right={<><IconButton name="search" label="Cerca" onPress={() => router.push('/cerca')} /><IconButton name="person-circle-outline" label="Il mio futsal" onPress={() => router.push('/profilo')} /></>}>
      {featured ? (
        <Pressable onPress={() => router.push(`/evento/${featured.slug}`)} style={[st.hero, { backgroundColor: featured.theme.primary }]}>
          <Text style={[type.label, { color: colors.lime }]}>In evidenza · {featured.kicker}</Text>
          <Text style={st.heroTitle}>{featured.title}</Text>
          <Text style={st.heroSub}>{featured.subtitle}</Text>
          <View style={{ flexDirection: 'row', gap: space.s, marginTop: space.s }}>
            {featured.ticketUrl ? <PillButton label="Biglietti" icon="ticket-outline" onPress={() => openUrl(featured.ticketUrl)} /> : null}
            <PillButton label="Apri l'evento" variant="ghost" onPress={() => router.push(`/evento/${featured.slug}`)} />
          </View>
        </Pressable>
      ) : null}

      <View style={st.quick}>
        {quick.map((q) => (
          <Pressable key={q.label} style={st.qt} onPress={q.onPress} accessibilityRole="button">
            <View style={[st.qIcon, { backgroundColor: q.bg }]}><Ionicons name={q.icon} size={20} color={q.fg ?? colors.white} /></View>
            <Text style={st.qText}>{q.label}</Text>
          </Pressable>
        ))}
      </View>

      {live.value?.length ? (
        <>
          <Section title="Live ora" action="Tutte" onAction={() => router.push('/partite')} />
          {live.value.map((m) => <MatchCard key={m.id} match={m} home={teams[m.homeId]} away={teams[m.awayId]} />)}
        </>
      ) : null}

      <Section title="Ultime news" />
      {(news.value ?? []).slice(0, 3).map((n) => (
        <Card key={n.id} style={st.news} onPress={() => router.push(`/news/${n.id}`)}>
          <Text style={[type.label, { color: colors.lime }]}>{n.tag}</Text>
          <Text style={st.newsTitle}>{n.title}</Text>
        </Card>
      ))}

      {comm.value?.length ? (
        <>
          <Section title="Comunicati ufficiali" action="Tutti" onAction={() => router.push('/comunicati')} />
          {comm.value.slice(0, 2).map((c) => (
            <Card key={c.id} style={st.news} onPress={() => router.push('/comunicati')}>
              <Text style={[type.label, { color: colors.oro }]}>{c.kind}</Text>
              <Text style={st.newsTitle}>{c.title}</Text>
            </Card>
          ))}
        </>
      ) : null}

      {scorers.value?.length ? (
        <>
          <Section title="Capocannonieri Serie A" />
          <Card>
            {scorers.value.map((p, i) => {
              const t = teams[p.teamId];
              return (
                <Pressable key={p.id} onPress={() => router.push(`/giocatore/${p.id}`)} style={[st.scorer, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
                  <Crest short={t?.short ?? ''} color={t?.color ?? colors.line} />
                  <View style={{ flex: 1 }}><Text style={st.newsTitle}>{p.name}</Text><Text style={st.muted}>{t?.name}</Text></View>
                  <Text style={st.goals}>{p.stats.goals}</Text>
                </Pressable>
              );
            })}
          </Card>
        </>
      ) : null}

      <Section title="I nostri partner" action="Tutti" onAction={() => router.push('/partner')} />
      <Card style={{ padding: 14 }} onPress={() => router.push('/partner')}>
        <Text style={{ color: colors.ink, fontSize: 13, fontWeight: '700' }}>{(partners.value ?? []).filter((p) => p.tier === 'principale').slice(0, 6).map((p) => p.name).join(' · ')}</Text>
        <Text style={st.muted}>e tutti gli altri partner della stagione 2026/27</Text>
      </Card>

      <Section title="Segui la Divisione" />
      <SocialLinks />
      <View style={{ height: space.m }} />
      <PillButton label="Visita il sito della Divisione" variant="ghost" icon="open-outline" onPress={() => openUrl(config.siteUrl)} />
    </Screen>
  );
}

const st = StyleSheet.create({
  hero: { borderRadius: 20, padding: space.l, minHeight: 160, justifyContent: 'flex-end' },
  heroTitle: { color: colors.white, fontSize: 25, lineHeight: 26, fontWeight: '900', textTransform: 'uppercase', marginTop: 6 },
  heroSub: { color: colors.white, opacity: 0.8, fontSize: 12, fontWeight: '600', marginTop: 4 },
  quick: { flexDirection: 'row', gap: space.s, marginTop: space.m },
  qt: { flex: 1, backgroundColor: colors.card, borderRadius: 16, paddingVertical: 12, alignItems: 'center', gap: 6 },
  qIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qText: { color: colors.ink, fontSize: 11, fontWeight: '600' },
  news: { padding: 14, marginBottom: 9 },
  newsTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: 3 },
  muted: { color: colors.muted, fontSize: 12 },
  scorer: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 10 },
  goals: { color: colors.lime, fontSize: 22, fontWeight: '900' },
});
