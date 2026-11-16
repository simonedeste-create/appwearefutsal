// Backend di autenticazione LOCALE, solo per sviluppo e prove: gli account restano sul dispositivo.
// Le password non sono mai salvate in chiaro (impronta con sale). In produzione sostituire con
// un servizio vero (es. Firebase Authentication) che gestisca email di conferma e recupero password.
import * as SecureStore from 'expo-secure-store';
import { AuthBackend, AuthError, SignUpInput, User } from './types';
import { isEmail, needsParentalConsent, passwordProblem } from './validation';

const USERS_KEY = 'waf_users_v1';
const SESSION_KEY = 'waf_session_v1';

interface StoredUser { user: User; salt: string; hash: string }

// Impronta semplice (FNV-1a ripetuta): sufficiente per il prototipo locale, non per un server.
function digest(text: string): string {
  let h1 = 0x811c9dc5; let h2 = 0x01000193;
  for (let round = 0; round < 2000; round++) {
    for (let i = 0; i < text.length; i++) {
      h1 ^= text.charCodeAt(i); h1 = Math.imul(h1, 0x01000193);
      h2 ^= h1 >>> 7; h2 = Math.imul(h2, 0x5bd1e995);
    }
  }
  return (h1 >>> 0).toString(16).padStart(8, '0') + (h2 >>> 0).toString(16).padStart(8, '0');
}
const randomId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

async function readUsers(): Promise<StoredUser[]> {
  try { return JSON.parse((await SecureStore.getItemAsync(USERS_KEY)) ?? '[]') as StoredUser[]; } catch { return []; }
}
const writeUsers = (u: StoredUser[]) => SecureStore.setItemAsync(USERS_KEY, JSON.stringify(u));

export const localBackend: AuthBackend = {
  async restore() {
    const id = await SecureStore.getItemAsync(SESSION_KEY);
    if (!id) return null;
    return (await readUsers()).find((s) => s.user.id === id)?.user ?? null;
  },

  async signIn(email, password) {
    const users = await readUsers();
    const found = users.find((s) => s.user.email === email.trim().toLowerCase());
    if (!found || digest(found.salt + password) !== found.hash) throw new AuthError('Email o password non corretti.');
    await SecureStore.setItemAsync(SESSION_KEY, found.user.id);
    return found.user;
  },

  async signUp(input: SignUpInput) {
    const email = input.email.trim().toLowerCase();
    if (!isEmail(email)) throw new AuthError('Inserisci un indirizzo email valido.');
    const pw = passwordProblem(input.password);
    if (pw) throw new AuthError(pw);
    if (!input.firstName.trim() || !input.lastName.trim()) throw new AuthError('Inserisci nome e cognome.');
    if (needsParentalConsent(input.birthDate) && !input.parental) throw new AuthError('Per chi ha meno di 14 anni serve il consenso di un genitore.');
    const users = await readUsers();
    if (users.some((s) => s.user.email === email)) throw new AuthError('Esiste già un account con questa email: accedi.');
    const user: User = {
      id: randomId(), email, firstName: input.firstName.trim(), lastName: input.lastName.trim(),
      birthDate: input.birthDate, favoriteTeamIds: [],
      consents: { privacy: true, terms: true, marketing: input.marketing, partners: input.partners, parental: input.parental || undefined },
      createdAt: new Date().toISOString(),
    };
    const salt = randomId();
    await writeUsers([...users, { user, salt, hash: digest(salt + input.password) }]);
    await SecureStore.setItemAsync(SESSION_KEY, user.id);
    return user;
  },

  async signOut() { await SecureStore.deleteItemAsync(SESSION_KEY); },

  async resetPassword(email) {
    if (!isEmail(email)) throw new AuthError('Inserisci un indirizzo email valido.');
    // Con il backend reale qui parte l'email di recupero. In locale non c'è nulla da inviare.
  },

  async updateProfile(patch) {
    const id = await SecureStore.getItemAsync(SESSION_KEY);
    const users = await readUsers();
    const s = users.find((x) => x.user.id === id);
    if (!s) throw new AuthError('Sessione scaduta: accedi di nuovo.');
    const { marketing, partners, ...rest } = patch;
    s.user = { ...s.user, ...rest, consents: { ...s.user.consents, ...(marketing != null ? { marketing } : {}), ...(partners != null ? { partners } : {}) } };
    await writeUsers(users);
    return s.user;
  },

  async deleteAccount() {
    const id = await SecureStore.getItemAsync(SESSION_KEY);
    await writeUsers((await readUsers()).filter((s) => s.user.id !== id));
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },
};
