// Giochi e azioni del tifoso: pronostici 1-X-2 e voto all'MVP. Oggi restano sul dispositivo;
// con il backend (Fase 2) diventano classifiche tra utenti e leghe di amici.
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import type { Match } from './data/types';

const KEY = 'waf_fan_v1';
export type Pick = '1' | 'X' | '2';
interface FanState { picks: Record<string, Pick>; mvp: Record<string, string> }
const EMPTY: FanState = { picks: {}, mvp: {} };

/** Punti: 3 per ogni pronostico azzeccato su una gara conclusa. */
export function pickResult(m: Match): Pick | undefined {
  if (m.status !== 'finished' || m.homeScore == null || m.awayScore == null) return undefined;
  return m.homeScore > m.awayScore ? '1' : m.homeScore < m.awayScore ? '2' : 'X';
}
export function scorePicks(picks: Record<string, Pick>, matches: Match[]) {
  let right = 0; let played = 0;
  matches.forEach((m) => {
    const r = pickResult(m); const p = picks[m.id];
    if (!r || !p) return;
    played++; if (r === p) right++;
  });
  return { played, right, points: right * 3 };
}

export function useFan() {
  const [state, setState] = useState<FanState>(EMPTY);
  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((v) => setState(v ? ({ ...EMPTY, ...(JSON.parse(v) as FanState) }) : EMPTY)).catch(() => undefined);
  }, []);
  const save = useCallback((fn: (s: FanState) => FanState) => {
    setState((cur) => {
      const next = fn(cur);
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);
  return {
    picks: state.picks,
    pick: (matchId: string) => state.picks[matchId],
    setPick: (matchId: string, p: Pick) => save((s) => ({ ...s, picks: { ...s.picks, [matchId]: p } })),
    mvp: (matchId: string) => state.mvp[matchId],
    setMvp: (matchId: string, playerId: string) => save((s) => ({ ...s, mvp: { ...s.mvp, [matchId]: playerId } })),
    mvpCount: Object.keys(state.mvp).length,
  };
}

/** Indirizzo per aggiungere la gara al calendario (Google Calendar, apribile da qualsiasi telefono). */
export function calendarUrl(title: string, startIso: string, venue: string, minutes = 60) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(startIso); const end = new Date(start.getTime() + minutes * 60000);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(venue)}`;
}
