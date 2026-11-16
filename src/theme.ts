// Stile "Night Arena" scelto per l'app (navy, blu elettrico, lime),
// con i colori istituzionali del design system della Divisione Calcio a 5.
export const colors = {
  bg: '#050B2E',
  bgTab: '#081040',
  card: '#0E1A4F',
  card2: '#13226A',
  line: '#22307A',
  electric: '#2E5BFF',
  reflexBlue: '#001489', // Pantone Reflex Blue C, colore istituzionale
  bluElettrico: '#0B18C8',
  lime: '#C6FF3D',
  ink: '#F4F6FF',
  muted: '#9AA6D6',
  rosa: '#E63255', // campionati femminili
  oro: '#C8AA5A', // Shop e premium
  live: '#FF3B3B',
  white: '#FFFFFF',
  onLime: '#061040',
  liveDeep: '#2A0810', // fondo del riquadro "in diretta" di FUTSAL TV
  liveTile: '#3A0A12',
  error: 'rgba(255,59,59,0.85)',
  tricoloreVerde: '#00923A', // filetto tricolore del brand LND
  tricoloreRosso: '#E20613',
  sky: '#0072C9', // etichetta trasmissione Sky Sport
  youtube: '#FF0000', // etichetta canale YouTube della Divisione
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;
export const radius = { s: 8, m: 14, l: 18, xl: 22, pill: 999 } as const;

export const type = {
  display: { fontSize: 26, fontWeight: '900' as const, letterSpacing: 0.3, textTransform: 'uppercase' as const },
  title: { fontSize: 17, fontWeight: '900' as const, letterSpacing: 0.6, textTransform: 'uppercase' as const },
  body: { fontSize: 15, fontWeight: '500' as const },
  small: { fontSize: 12, fontWeight: '600' as const },
  label: { fontSize: 11, fontWeight: '800' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  score: { fontSize: 22, fontWeight: '900' as const },
};
