// Promemoria "Ricordamelo" per le dirette in palinsesto. Oggi restano sul dispositivo;
// con le notifiche push (Fase 2) il server invierà l'avviso all'inizio della diretta.
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

const KEY = 'waf_reminders_v1';

export function useReminders() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((v) => setIds(v ? (JSON.parse(v) as string[]) : [])).catch(() => undefined);
  }, []);
  const toggle = useCallback((id: string) => {
    setIds((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);
  return { has: (id: string) => ids.includes(id), toggle };
}
