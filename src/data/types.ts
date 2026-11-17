export type Gender = 'M' | 'F';

export interface Competition {
  id: string;
  name: string;
  short: string;
  gender: Gender;
  /** false = campionato visibile ma dati non ancora collegati */
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  short: string; // sigla di 3 lettere
  color: string;
  competitionId: string;
  city: string;
  venue: string;
  /** elenco delle gare della squadra su FUTSAL TV, se la piattaforma lo fornisce */
  futsalTvUrl?: string;
}

export type MatchStatus = 'scheduled' | 'live' | 'finished';

export interface MatchEvent {
  minute: string; // es. "2T 12'"
  type: 'goal' | 'yellow' | 'red';
  teamId: string;
  playerId?: string;
  text: string;
}

export interface Match {
  id: string;
  competitionId: string;
  round: number;
  roundLabel: string;
  date: string; // ISO 8601
  venue: string;
  homeId: string;
  awayId: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  clock?: string;
  futsalTvUrl?: string;
  /** dove si vede la gara: FUTSAL TV, canale YouTube della Divisione o Sky Sport */
  broadcast?: Broadcast;
  events?: MatchEvent[];
}

export interface PlayerStats {
  apps: number;
  goals: number;
  assists: number;
  minutes: number;
  shotsOnTarget?: number;
  /** dati VEO, quando disponibili */
  veo?: { shotAccuracy: number; duelsWon: number; recoveries: number };
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  number: number;
  role: 'Portiere' | 'Centrale' | 'Laterale' | 'Pivot' | 'Universale';
  birthYear: number;
  nationality: string;
  photoUrl?: string;
  stats: PlayerStats;
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  tag: string;
  date: string;
  imageUrl?: string;
}

export type Channel = 'FUTSAL TV' | 'YouTube Divisione' | 'Sky Sport';

export interface Broadcast {
  channel: Channel;
  url: string;
}

export interface Video {
  id: string;
  title: string;
  /** live = in onda ora; upcoming = in palinsesto; gli altri sono video on demand */
  kind: 'live' | 'upcoming' | 'highlight' | 'replay' | 'rubrica';
  channel: Channel;
  url: string;
  competitionId?: string;
  matchId?: string;
  startsAt?: string; // ISO, per live e palinsesto
  duration?: string;
  subtitle?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  emoji: string;
  /** prezzo in centesimi di euro */
  priceCents: number;
  description: string;
  /** taglie disponibili, se il prodotto le prevede */
  sizes?: string[];
  /** pagina del prodotto sullo shop ufficiale */
  url: string;
}

export interface CartLine { productId: string; size?: string; qty: number }

export type EventModuleKey = 'programma' | 'sedi' | 'biglietti' | 'info' | 'news';

export interface EventVenue {
  city: string;
  name: string;
  mapsQuery: string;
}

export interface EventModule {
  slug: string;
  kicker: string;
  title: string;
  subtitle: string;
  dates: string;
  theme: { primary: string; accent: string };
  modules: EventModuleKey[];
  venues: EventVenue[];
  ticketUrl?: string;
  /** web app esterna già esistente (es. Torneo delle Regioni) */
  webAppUrl?: string;
  info: string;
  matches: Match[];
  teams: Team[];
}

export type CommuniqueKind = 'Giudice sportivo' | 'Comunicato ufficiale' | 'Designazioni arbitrali' | 'Calendari';
export interface Communique {
  id: string;
  kind: CommuniqueKind;
  date: string; // ISO 8601
  title: string;
  body: string;
  competitionId?: string;
  /** PDF ufficiale del comunicato, se pubblicato */
  pdfUrl?: string;
}

export interface Partner {
  id: string;
  name: string;
  tier: 'principale' | 'secondario';
  /** ruolo del partner, solo se confermato dalla Divisione */
  role?: string;
  /** pagina del partner o offerta riservata alla community */
  url?: string;
  offer?: string;
}

export interface SearchResults {
  teams: Team[];
  players: Player[];
  news: NewsItem[];
  communiques: Communique[];
}
