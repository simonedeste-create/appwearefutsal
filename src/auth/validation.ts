import { config } from '../config';

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

/** Almeno 8 caratteri, con almeno una lettera e un numero. */
export const passwordProblem = (p: string): string | null => {
  if (p.length < 8) return 'La password deve avere almeno 8 caratteri.';
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return 'La password deve contenere lettere e numeri.';
  return null;
};

/** Accetta GG/MM/AAAA e restituisce AAAA-MM-GG, oppure null se la data non è valida. */
export function parseItalianDate(s: string): string | null {
  const m = s.trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null;
  if (y < 1900 || date.getTime() > Date.now()) return null;
  return `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function ageFrom(isoDate: string, now = new Date()): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age--;
  return age;
}

export const needsParentalConsent = (isoDate: string) => ageFrom(isoDate) < config.minAgeWithoutParent;
