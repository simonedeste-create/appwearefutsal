import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Match, Team } from '../data/types';
import { colors, space } from '../theme';
import { Card, Crest, FutsalTvButton, LiveBadge } from './ui';

export const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
export const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/Rome' }).toUpperCase();

function Row({ team, score, win }: { team?: Team; score?: number; win?: boolean }) {
  return (
    <View style={st.row}>
      <Crest short={team?.short ?? '?'} color={team?.color ?? colors.line} />
      <Text style={[st.name, win === false && { color: colors.muted }]} numberOfLines={1}>{team?.name ?? 'Da definire'}</Text>
      <Text style={[st.score, win === false && { color: colors.muted }]}>{score ?? ''}</Text>
    </View>
  );
}

export function MatchCard({ match, home, away, label }: { match: Match; home?: Team; away?: Team; label?: string }) {
  const played = match.status !== 'scheduled';
  const hs = match.homeScore ?? 0; const as = match.awayScore ?? 0;
  const done = match.status === 'finished';
  return (
    <Card style={st.card} onPress={() => router.push(`/partita/${match.id}`)}>
      <View style={st.meta}>
        <Text style={st.metaText}>{label ?? `${match.roundLabel.toUpperCase()} · ${fmtDay(match.date)}`}</Text>
        {match.status === 'live' ? <LiveBadge clock={match.clock} />
          : done ? <Text style={st.metaText}>Finale</Text>
          : <Text style={[st.metaText, { color: colors.lime }]}>{fmtTime(match.date)}</Text>}
      </View>
      <Row team={home} score={played ? hs : undefined} win={done ? hs >= as : undefined} />
      <Row team={away} score={played ? as : undefined} win={done ? as >= hs : undefined} />
      <View style={[st.meta, { marginTop: space.s - 2, marginBottom: 0 }]}>
        <Text style={st.metaText}>📍 {match.venue}</Text>
        <FutsalTvButton url={match.futsalTvUrl} label={match.status === 'live' ? 'LIVE' : done ? 'REPLAY' : undefined} />
      </View>
    </Card>
  );
}

const st = StyleSheet.create({
  card: { paddingVertical: 12, paddingHorizontal: 14, marginBottom: 9 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  metaText: { color: colors.muted, fontSize: 11, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  name: { flex: 1, color: colors.ink, fontSize: 14, fontWeight: '600' },
  score: { color: colors.ink, fontSize: 20, fontWeight: '900', minWidth: 24, textAlign: 'right' },
});
