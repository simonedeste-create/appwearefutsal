import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { config } from '../config';
import { localBackend } from './localBackend';
import type { AuthBackend, SignUpInput, User } from './types';

/** Backend attivo. Sostituire con quello di produzione (es. Firebase) mantenendo l'interfaccia. */
const backend: AuthBackend = localBackend;

interface AuthState {
  user: User | null;
  ready: boolean; // false finché non si è verificata la sessione salvata
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: AuthBackend['updateProfile'];
  deleteAccount: () => Promise<void>;
  /** true se il contenuto richiede l'accesso secondo config.authMode */
  needsLogin: (area: 'app' | 'video' | 'personal') => boolean;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    backend.restore().then(setUser).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (e: string, p: string) => { setUser(await backend.signIn(e, p)); }, []);
  const signUp = useCallback(async (i: SignUpInput) => { setUser(await backend.signUp(i)); }, []);
  const signOut = useCallback(async () => { await backend.signOut(); setUser(null); }, []);
  const deleteAccount = useCallback(async () => { await backend.deleteAccount(); setUser(null); }, []);
  const updateProfile = useCallback<AuthBackend['updateProfile']>(async (p) => { const u = await backend.updateProfile(p); setUser(u); return u; }, []);

  const value = useMemo<AuthState>(() => ({
    user, ready, signIn, signUp, signOut, deleteAccount, updateProfile,
    resetPassword: backend.resetPassword,
    needsLogin: (area) => {
      if (user) return false;
      if (config.authMode === 'required') return true;
      if (config.authMode === 'video') return area !== 'app';
      return area === 'personal';
    },
  }), [user, ready, signIn, signUp, signOut, deleteAccount, updateProfile]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth va usato dentro AuthProvider');
  return v;
}
