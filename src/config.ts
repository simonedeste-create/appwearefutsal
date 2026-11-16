// Configurazione generale dell'app. Le voci marcate "DA VERIFICARE" vanno confermate dalla Divisione.
export type AuthMode = 'required' | 'video' | 'optional';

export const config = {
  /**
   * Accesso:
   * - 'required': registrazione e login obbligatori per usare l'app (scelta attuale della Divisione);
   * - 'video': app libera, login richiesto per FUTSAL TV e per l'area personale;
   * - 'optional': login solo per l'area personale.
   * Nota per l'App Store: Apple (linea guida 5.1.1(v)) può respingere un'app che chiede la registrazione
   * per contenuti non legati all'account. In quel caso passare a 'video'.
   */
  authMode: 'required' as AuthMode,
  /** Età minima per registrarsi in autonomia (Italia: 14 anni per il consenso digitale). */
  minAgeWithoutParent: 14,

  futsalTv: {
    name: 'FUTSAL TV',
    url: 'https://www.futsaltv.it',
    // Canale YouTube ufficiale della Divisione, dove vanno in diretta le gare non trasmesse in TV.
    youtubeUrl: 'https://www.youtube.com/@DivisioneCalcioaCinque',
    /** Le dirette si aprono nel browser interno dell'app; con il player/SDK della piattaforma si potranno vedere dentro l'app. */
    openInApp: true,
  },

  // Canali ufficiali della Divisione Calcio a 5 (come nelle descrizioni del canale YouTube ufficiale).
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@divisionecalcio5', icon: 'logo-instagram', url: 'https://www.instagram.com/divisionecalcio5/' },
    { id: 'facebook', label: 'Facebook', handle: 'DivisioneCalcioacinque', icon: 'logo-facebook', url: 'https://www.facebook.com/DivisioneCalcioacinque' },
  ] as const,

  // TODO: sostituire con l'indirizzo dello Shop ufficiale della Divisione.
  shopUrl: 'https://www.divisionecalcioa5.it',
  siteUrl: 'https://www.divisionecalcioa5.it',
  vivaticketUrl: 'https://www.vivaticket.com',
  privacyUrl: 'https://www.divisionecalcioa5.it/privacy-policy', // DA VERIFICARE
  termsUrl: 'https://www.divisionecalcioa5.it/termini', // DA VERIFICARE

  /** Quando true l'app mostra il bollino "dati di esempio" (sorgente mock). */
  demoData: true,
};

// Compatibilità con il codice esistente.
export const futsalTvUrl = config.futsalTv.url;
