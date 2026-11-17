// Azioni del tifoso: voto all'MVP. Oggi resta sul dispositivo; con il backend diventerà un voto unico per utente.
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'waf_mvp_v1';

export function useFan() {
  const [mvp, setMvp] = useState<Record<string, string>>({});
  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((v) => setMvp(v ? (JSON.parse(v) as Record<string, string>) : {})).catch(() => undefined);
  }, []);
  const vote = useCallback((matchId: string, playerId: string) => {
    setMvp((cur) => {
      const next = { ...cur, [matchId]: playerId };
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);
  return { mvp: (matchId: string) => mvp[matchId], setMvp: vote, mvpCount: Object.keys(mvp).length };
}

/** Indirizzo per aggiungere la gara al calendario (Google Calendar, apribile da qualsiasi telefono). */
export function calendarUrl(title: string, startIso: string, venue: string, minutes = 60) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const start = new Date(startIso); const end = new Date(start.getTime() + minutes * 60000);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${fmt(start)}/${fmt(end)}&location=${encodeURIComponent(venue)}`;
}
