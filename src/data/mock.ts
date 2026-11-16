// DATI DI ESEMPIO. Squadre indicate con nomi di città, risultati e giocatori inventati.
// Servono solo a sviluppare e mostrare l'app finché non sono collegate le fonti reali
// (TuttoCampo, sito divisionecalcioa5.it, FUTSAL TV, Shop, Vivaticket, VEO).
import { config } from '../config';
import type {
  Competition, EventModule, Match, NewsItem, Player, Product, Team, Video,
} from './types';

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const competitions: Competition[] = [
  { id: 'serie-a', name: 'Serie A', short: 'Serie A', gender: 'M', active: true },
  { id: 'a2-elite', name: 'Serie A2 Elite', short: 'A2 Elite', gender: 'M', active: false },
  { id: 'serie-a2', name: 'Serie A2', short: 'Serie A2', gender: 'M', active: false },
  { id: 'serie-b', name: 'Serie B', short: 'Serie B', gender: 'M', active: false },
  { id: 'serie-a-f', name: 'Serie A Femminile', short: 'Serie A F', gender: 'F', active: true },
  { id: 'u19-f', name: 'Under 19 Femminile', short: 'U19 F', gender: 'F', active: false },
  { id: 'coppa-italia', name: 'Coppa Italia', short: 'Coppa Italia', gender: 'M', active: false },
];

const PALETTE = ['#2E5BFF', '#7A3BFF', '#0B18C8', '#E63255', '#00A3A3', '#FF7A1A', '#3D9B35', '#B23BD6'];

function makeTeams(compId: string, cities: [string, string, string][]): Team[] {
  return cities.map(([city, short, venue], i) => ({
    id: `${compId}-${short.toLowerCase()}`,
    name: city,
    short,
    city,
    venue,
    color: PALETTE[i % PALETTE.length],
    competitionId: compId,
  }));
}

export const teams: Team[] = [
  ...makeTeams('serie-a', [
    ['Pesaro', 'PES', 'PalaCampanara'], ['Napoli', 'NAP', 'PalaCercola'], ['Roma', 'ROM', 'PalaTorrino'],
    ['Catania', 'CAT', 'PalaCatania'], ['Padova', 'PAD', 'PalaAntenore'], ['Meta', 'MET', 'PalaMeta'],
    ['Pescara', 'PSC', 'PalaRigopiano'], ['Verona', 'VER', 'PalaVerona'],
  ]),
  ...makeTeams('serie-a-f', [
    ['Bitonto', 'BIT', 'PalaBitonto'], ['Roma', 'RMF', 'PalaRoma'], ['Pescara', 'PEF', 'PalaPescara'],
    ['Falconara', 'FAL', 'PalaBadiali'], ['Bologna', 'BOL', 'PalaBologna'], ['Cagliari', 'CAG', 'PalaCagliari'],
  ]),
];

const FIRST = ['Marco', 'Luca', 'Andrea', 'Matteo', 'Davide', 'Simone', 'Lorenzo', 'Alessio', 'Gabriele', 'Riccardo', 'Tommaso', 'Federico'];
const FIRST_F = ['Giulia', 'Sara', 'Martina', 'Chiara', 'Alessia', 'Francesca', 'Elisa', 'Valentina', 'Federica', 'Sofia', 'Aurora', 'Giorgia'];
const LAST = ['Rossi', 'Bianchi', 'Esposito', 'De Luca', 'Ferri', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'Mancini', 'Costa', 'Rizzo'];
const ROLES: Player['role'][] = ['Centrale', 'Laterale', 'Laterale', 'Pivot', 'Universale'];

export const players: Player[] = teams.flatMap((t, ti) => {
  const r = rng(100 + ti);
  const fem = t.competitionId.endsWith('-f');
  return Array.from({ length: 12 }, (_, i) => {
    const n = i + 1;
    const gk = n === 1 || n === 12;
    const apps = 8 + Math.floor(r() * 4);
    const goals = gk ? 0 : Math.floor(r() * (n === 10 ? 14 : 8));
    return {
      id: `${t.id}-${n}`,
      teamId: t.id,
      name: `${(fem ? FIRST_F : FIRST)[Math.floor(r() * 12)]} ${LAST[Math.floor(r() * LAST.length)]}`,
      number: n,
      role: gk ? 'Portiere' : ROLES[Math.floor(r() * ROLES.length)],
      birthYear: 1992 + Math.floor(r() * 14),
      nationality: 'Italia',
      stats: {
        apps,
        goals,
        assists: gk ? 0 : Math.floor(r() * 7),
        minutes: apps * (gk ? 40 : 15 + Math.floor(r() * 15)),
        shotsOnTarget: gk ? 0 : goals + Math.floor(r() * 10),
        veo: gk ? undefined : { shotAccuracy: 40 + Math.floor(r() * 30), duelsWon: 45 + Math.floor(r() * 30), recoveries: 30 + Math.floor(r() * 30) },
      },
    } satisfies Player;
  });
});

// Calendario a girone all'italiana (andata e ritorno) con risultati generati.
function roundRobin(ids: string[]): [string, string][][] {
  const list = [...ids];
  const rounds: [string, string][][] = [];
  for (let r = 0; r < list.length - 1; r++) {
    const round: [string, string][] = [];
    for (let i = 0; i < list.length / 2; i++) round.push([list[i], list[list.length - 1 - i]]);
    rounds.push(round);
    list.splice(1, 0, list.pop() as string);
  }
  return [...rounds, ...rounds.map((rd) => rd.map(([h, a]) => [a, h] as [string, string]))];
}

function makeMatches(compId: string, currentRound: number, firstDate: string): Match[] {
  const ids = teams.filter((t) => t.competitionId === compId).map((t) => t.id);
  const r = rng(compId.length * 31);
  const out: Match[] = [];
  roundRobin(ids).forEach((round, ri) => {
    const n = ri + 1;
    round.forEach(([h, a], mi) => {
      const date = new Date(firstDate);
      date.setDate(date.getDate() + ri * 7);
      date.setHours(18 + (mi % 3), mi % 2 ? 30 : 0);
      const home = teams.find((t) => t.id === h)!;
      let status: Match['status'] = n < currentRound ? 'finished' : 'scheduled';
      if (n === currentRound) status = mi === 0 ? 'live' : mi === 1 ? 'finished' : 'scheduled';
      const m: Match = {
        id: `${compId}-g${n}-${mi + 1}`,
        competitionId: compId,
        round: n,
        roundLabel: `${n}ª giornata`,
        date: date.toISOString(),
        venue: home.venue,
        homeId: h,
        awayId: a,
        status,
        futsalTvUrl: config.futsalTvUrl,
      };
      if (status !== 'scheduled') {
        m.homeScore = Math.floor(r() * 6);
        m.awayScore = Math.floor(r() * 5);
        if (status === 'live') m.clock = "2T 14'";
        m.events = goalEvents(m);
      }
      out.push(m);
    });
  });
  return out;
}

function goalEvents(m: Match): Match['events'] {
  const r = rng(m.id.length * 7 + (m.homeScore ?? 0));
  const ev: NonNullable<Match['events']> = [];
  const add = (teamId: string, count: number) => {
    const roster = players.filter((p) => p.teamId === teamId && p.role !== 'Portiere');
    for (let i = 0; i < count; i++) {
      const p = roster[Math.floor(r() * roster.length)];
      const half = r() < 0.5 ? '1T' : '2T';
      ev.push({ minute: `${half} ${String(1 + Math.floor(r() * 19)).padStart(2, '0')}'`, type: 'goal', teamId, playerId: p.id, text: `Gol · ${p.name}` });
    }
  };
  add(m.homeId, m.homeScore ?? 0);
  add(m.awayId, m.awayScore ?? 0);
  return ev.sort((a, b) => b.minute.localeCompare(a.minute));
}

export const matches: Match[] = [
  ...makeMatches('serie-a', 12, '2026-09-25T18:00:00+02:00'),
  ...makeMatches('serie-a-f', 9, '2026-10-02T18:00:00+02:00'),
];

export const news: NewsItem[] = [
  { id: 'n1', tag: 'Eventi', date: '2026-11-16', title: 'Futsal Finalissime: la Coppa Italia fa tappa in Puglia', body: 'Barletta, Bisceglie e Giovinazzo ospiteranno le Finalissime di Coppa Italia 2027. Programma, sedi e biglietti sono nella sezione Eventi dell’app.' },
  { id: 'n2', tag: 'Torneo delle Regioni', date: '2026-11-13', title: 'Torneo delle Regioni 2027: appuntamento nelle Marche', body: 'Dal 25 aprile al 1 maggio 2027 le rappresentative regionali di calcio a 5 si sfidano nei palazzetti marchigiani.' },
  { id: 'n3', tag: 'Nazionale', date: '2026-11-10', title: 'Italia – Ungheria a Castelnovo ne’ Monti', body: 'L’8 dicembre la Nazionale gioca al Palasport Giorgio Guidetti. Diretta su FUTSAL TV.' },
];

export const videos: Video[] = [
  { id: 'v1', title: 'Pesaro – Napoli', kind: 'live', url: config.futsalTvUrl },
  { id: 'v2', title: 'Bitonto – Roma', kind: 'live', url: config.futsalTvUrl },
  { id: 'v3', title: 'I gol dell’11ª giornata', kind: 'highlight', duration: '6:12', url: config.futsalTvUrl },
  { id: 'v4', title: 'Top 5 parate', kind: 'highlight', duration: '3:40', url: config.futsalTvUrl },
  { id: 'v5', title: 'Padova – Catania (integrale)', kind: 'replay', duration: '1:32:10', url: config.futsalTvUrl },
  { id: 'v6', title: 'Futsal Magazine', kind: 'rubrica', duration: '24:00', url: config.futsalTvUrl },
];

export const products: Product[] = [
  { id: 'p1', name: 'Felpa #WeAreFutsal', category: 'Abbigliamento', emoji: '👕', url: config.shopUrl },
  { id: 'p2', name: 'Pallone ufficiale', category: 'Palloni', emoji: '⚽', url: config.shopUrl },
  { id: 'p3', name: 'Sciarpa Finalissime', category: 'Eventi', emoji: '🧣', url: config.shopUrl },
  { id: 'p4', name: 'Cappellino', category: 'Abbigliamento', emoji: '🧢', url: config.shopUrl },
];

// Moduli evento ("app nell'app"). Squadre e partite degli eventi da caricare quando ufficiali.
export const events: EventModule[] = [
  {
    slug: 'finalissime-puglia-2027',
    kicker: 'Coppa Italia',
    title: 'Futsal Finalissime · Puglia 2027',
    subtitle: 'Barletta · Bisceglie · Giovinazzo',
    dates: 'Date da confermare',
    theme: { primary: '#0B18C8', accent: '#C6FF3D' },
    modules: ['programma', 'sedi', 'biglietti', 'info'],
    // TODO: verificare i nomi ufficiali degli impianti
    venues: [
      { city: 'Barletta', name: 'PalaDisfida Mario Borgia', mapsQuery: 'PalaDisfida Barletta' },
      { city: 'Bisceglie', name: 'PalaDolmen', mapsQuery: 'PalaDolmen Bisceglie' },
      { city: 'Giovinazzo', name: 'PalaPansini', mapsQuery: 'PalaPansini Giovinazzo' },
    ],
    ticketUrl: config.vivaticketUrl,
    info: 'Le Finalissime di Coppa Italia della Divisione Calcio a 5 in tre città pugliesi. Allo stadio di Barletta un’attività per le scuole calcio, con i bambini poi in tribuna per la finale.',
    matches: [],
    teams: [],
  },
  {
    slug: 'torneo-delle-regioni-2027',
    kicker: 'LND · Rappresentative',
    title: 'Torneo delle Regioni · Marche 2027',
    subtitle: 'Calcio a 5 · cinque categorie',
    dates: '25 aprile – 1 maggio 2027',
    theme: { primary: '#001489', accent: '#F8EB00' },
    modules: ['programma', 'sedi', 'info', 'news'],
    venues: [{ city: 'Marche', name: 'Impianti da definire', mapsQuery: 'Marche' }],
    info: 'Il torneo delle rappresentative regionali LND. Il modulo riprende la web app già prototipata: programma, risultati live, classifiche, schede giocatore con statistiche VEO e link FUTSAL TV.',
    matches: [],
    teams: [],
  },
  {
    slug: 'italia-ungheria-2026',
    kicker: 'Nazionale',
    title: 'Italia – Ungheria',
    subtitle: 'Amichevole internazionale',
    dates: '8 dicembre 2026',
    theme: { primary: '#0D2A6B', accent: '#C8AA5A' },
    modules: ['info', 'sedi'],
    venues: [{ city: 'Castelnovo ne’ Monti', name: 'Palasport Giorgio Guidetti', mapsQuery: 'Palasport Giorgio Guidetti Castelnovo ne Monti' }],
    info: 'La Nazionale italiana di futsal in amichevole contro l’Ungheria. Diretta su FUTSAL TV.',
    matches: [],
    teams: [],
  },
];
