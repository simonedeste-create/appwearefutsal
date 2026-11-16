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
    // Canale YouTube della Divisione, dove vanno in diretta le gare non trasmesse in TV. DA VERIFICARE l'indirizzo.
    youtubeUrl: 'https://www.youtube.com/@divisionecalcioa5',
    /** Le dirette si aprono nel browser interno dell'app; con il player/SDK della piattaforma si potranno vedere dentro l'app. */
    openInApp: true,
  },

  // Profili social ufficiali della Divisione. DA VERIFICARE tutti gli indirizzi prima della pubblicazione.
  social: [
    { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', url: 'https://www.instagram.com/divisionecalcioa5' },
    { id: 'facebook', label: 'Facebook', icon: 'logo-facebook', url: 'https://www.facebook.com/divisionecalcioa5' },
    { id: 'youtube', label: 'YouTube', icon: 'logo-youtube', url: 'https://www.youtube.com/@divisionecalcioa5' },
    { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', url: 'https://www.tiktok.com/@divisionecalcioa5' },
    { id: 'x', label: 'X', icon: 'logo-twitter', url: 'https://x.com/divisionec5' },
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
