// Notifiche push sul telefono: permesso e token. Il token va registrato sul backend insieme alle preferenze
// (src/notifications.ts); è il backend che invia gli avvisi a ogni gol, inizio e fine gara.
// Nota: le push non funzionano in Expo Go su Android né sul web; servono una build di sviluppo e un progetto EAS (projectId).
import * as Notifications from 'expo-notifications';
import type { NotifPrefs } from './notifications';

export type PushStatus = 'unknown' | 'granted' | 'denied';

export async function requestPush(): Promise<{ status: PushStatus; token?: string }> {
  try {
    let status = (await Notifications.getPermissionsAsync()).status;
    if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return { status: 'denied' };
    const t = await Notifications.getExpoPushTokenAsync();
    return { status: 'granted', token: t.data };
  } catch {
    return { status: 'unknown' };
  }
}

export interface PushBackend {
  /** Associa il telefono alle preferenze: il server sa così a chi inviare ogni evento. */
  register(token: string, prefs: NotifPrefs, followedTeamIds: string[]): Promise<void>;
}
/** Versione di sviluppo: non invia nulla. Sostituire con il backend reale. */
export const pushBackend: PushBackend = { register: () => Promise.resolve() };
