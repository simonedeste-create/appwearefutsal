export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string; // AAAA-MM-GG
  favoriteTeamIds: string[];
  consents: {
    privacy: true; // obbligatorio
    terms: true; // obbligatorio
    marketing: boolean; // facoltativo
    partners: boolean; // facoltativo: comunicazioni dei partner
    parental?: boolean; // consenso del genitore per chi ha meno di 14 anni
  };
  createdAt: string;
}

export interface SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  marketing: boolean;
  partners: boolean;
  parental: boolean;
}

/** Errore con messaggio già pronto da mostrare all'utente. */
export class AuthError extends Error {}

/**
 * Backend di autenticazione. Oggi c'è una versione locale (solo sul dispositivo, per sviluppo);
 * in produzione va sostituita con il servizio scelto (es. Firebase Authentication),
 * implementando gli stessi metodi.
 */
export interface AuthBackend {
  restore(): Promise<User | null>;
  signIn(email: string, password: string): Promise<User>;
  signUp(input: SignUpInput): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(patch: Partial<Pick<User, 'firstName' | 'lastName' | 'favoriteTeamIds'>> & { marketing?: boolean; partners?: boolean }): Promise<User>;
  /** Obbligatoria per l'App Store: chi crea un account deve poterlo eliminare dall'app. */
  deleteAccount(): Promise<void>;
}
