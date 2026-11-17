// Preferenze delle notifiche e testi di anteprima. Le preferenze restano sul dispositivo; quando c'è il backend
// vengono inviate insieme al token del telefono (vedi src/push.ts) e il server decide chi avvisare a ogni evento della gara.
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

export type LiveEvent = 'start' | 'goal' | 'half' | 'card' | 'final';
export type OtherEvent = 'tv' | 'communique' | 'news' | 'shop';
export type EventId = LiveEvent | OtherEvent;

export const LIVE_EVENTS: { id: LiveEvent; label: string; hint: string }[] = [
  { id: 'start', label: 'Fischio d’inizio', hint: 'Quando comincia la partita' },
  { id: 'goal', label: 'Gol', hint: 'Marcatore, minuto e nuovo punteggio' },
  { id: 'half', label: 'Fine primo tempo', hint: 'Punteggio all’intervallo' },
  { id: 'card', label: 'Cartellini rossi', hint: 'Espulsioni' },
  { id: 'final', label: 'Risultato finale', hint: 'Punteggio a fine gara' },
];
export const OTHER_EVENTS: { id: OtherEvent; label: string }[] = [
  { id: 'tv', label: 'Dirette su FUTSAL TV' },
  { id: 'communique', label: 'Comunicati ufficiali' },
  { id: 'news', label: 'News della Divisione' },
  { id: 'shop', label: 'Offerte dello Shop' },
];

export type Scope = 'followed' | 'all';
export interface NotifPrefs {
  /** per quali partite arrivano gli avvisi live: solo le squadre seguite o tutte */
  scope: Scope;
  events: Record<EventId, boolean>;
  /** partite per cui l'utente ha attivato la campanella nel match center */
  matchAlerts: string[];
}

const KEY = 'waf_notif_v1';
const DEFAULTS: NotifPrefs = {
  scope: 'followed',
  events: { start: true, goal: true, half: false, card: false, final: true, tv: true, communique: true, news: false, shop: false },
  matchAlerts: [],
};

export function useNotifPrefs() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULTS);
  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((v) => {
      if (!v) return;
      const saved = JSON.parse(v) as Partial<NotifPrefs>;
      setPrefs({ ...DEFAULTS, ...saved, events: { ...DEFAULTS.events, ...(saved.events ?? {}) } });
    }).catch(() => undefined);
  }, []);
  const save = useCallback((fn: (p: NotifPrefs) => NotifPrefs) => {
    setPrefs((cur) => {
      const next = fn(cur);
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);
  return {
    prefs,
    setScope: (scope: Scope) => save((p) => ({ ...p, scope })),
    setEvent: (id: EventId, on: boolean) => save((p) => ({ ...p, events: { ...p.events, [id]: on } })),
    hasMatchAlert: (matchId: string) => prefs.matchAlerts.includes(matchId),
    toggleMatchAlert: (matchId: string) => save((p) => ({
      ...p,
      matchAlerts: p.matchAlerts.includes(matchId) ? p.matchAlerts.filter((x) => x !== matchId) : [...p.matchAlerts, matchId],
    })),
  };
}

/** Testi di esempio delle notifiche live, mostrati nell'anteprima delle impostazioni. */
export const PREVIEWS: Record<LiveEvent, { title: string; body: string }> = {
  start: { title: 'Serie A · Si parte!', body: 'Pesaro – Napoli: fischio d’inizio al PalaCarifac.' },
  goal: { title: '⚽ Gol! Pesaro 3 – 2 Napoli', body: '2T 12’ · Rossi (Pesaro)' },
  half: { title: 'Fine primo tempo', body: 'Pesaro 2 – 2 Napoli' },
  card: { title: '🟥 Espulso Esposito (Napoli)', body: '2T 05’ · Pesaro 2 – 2 Napoli' },
  final: { title: 'Finale · Pesaro 3 – 2 Napoli', body: 'Rivedi la gara su FUTSAL TV.' },
};
