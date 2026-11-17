// Unico punto di accesso ai dati. Le schermate usano solo `data`, mai i file mock direttamente:
// per collegare le fonti reali basta scrivere un'altra implementazione di DataSource
// (es. TuttoCampo per calendari e risultati, sito per news, backend per live e statistiche).
import * as mock from './mock';
import type {
  Communique, Competition, EventModule, Partner, SearchResults, Match, NewsItem, Player, Product, StandingRow, Team, Video,
} from './types';

export interface DataSource {
  competitions(): Promise<Competition[]>;
  teams(competitionId?: string): Promise<Team[]>;
  team(id: string): Promise<Team | undefined>;
  matches(filter?: { competitionId?: string; round?: number; status?: Match['status']; teamId?: string }): Promise<Match[]>;
  match(id: string): Promise<Match | undefined>;
  rounds(competitionId: string): Promise<{ current: number; total: number }>;
  standings(competitionId: string): Promise<StandingRow[]>;
  players(teamId: string): Promise<Player[]>;
  player(id: string): Promise<Player | undefined>;
  topScorers(competitionId?: string, limit?: number): Promise<Player[]>;
  news(): Promise<NewsItem[]>;
  newsItem(id: string): Promise<NewsItem | undefined>;
  videos(filter?: { kind?: Video['kind']; competitionId?: string; matchId?: string }): Promise<Video[]>;
  products(): Promise<Product[]>;
  product(id: string): Promise<Product | undefined>;
  events(): Promise<EventModule[]>;
  event(slug: string): Promise<EventModule | undefined>;
  communiques(filter?: { kind?: Communique['kind'] }): Promise<Communique[]>;
  partners(): Promise<Partner[]>;
  search(query: string): Promise<SearchResults>;
}

const ok = <T,>(v: T) => Promise.resolve(v);

export function computeStandings(competitionId: string, all: Match[], teamList: Team[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  teamList.filter((t) => t.competitionId === competitionId).forEach((t) =>
    rows.set(t.id, { teamId: t.id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }));
  all.filter((m) => m.competitionId === competitionId && m.status === 'finished').forEach((m) => {
    const h = rows.get(m.homeId); const a = rows.get(m.awayId);
    if (!h || !a) return;
    const hs = m.homeScore ?? 0; const as = m.awayScore ?? 0;
    h.played++; a.played++; h.goalsFor += hs; h.goalsAgainst += as; a.goalsFor += as; a.goalsAgainst += hs;
    if (hs > as) { h.won++; a.lost++; h.points += 3; } else if (hs < as) { a.won++; h.lost++; a.points += 3; } else { h.drawn++; a.drawn++; h.points++; a.points++; }
  });
  return [...rows.values()].sort((x, y) =>
    y.points - x.points || (y.goalsFor - y.goalsAgainst) - (x.goalsFor - x.goalsAgainst) || y.goalsFor - x.goalsFor);
}

export const mockSource: DataSource = {
  competitions: () => ok(mock.competitions),
  teams: (cid) => ok(cid ? mock.teams.filter((t) => t.competitionId === cid) : mock.teams),
  team: (id) => ok(mock.teams.find((t) => t.id === id)),
  matches: (f = {}) => ok(mock.matches.filter((m) =>
    (!f.competitionId || m.competitionId === f.competitionId) &&
    (f.round == null || m.round === f.round) &&
    (!f.status || m.status === f.status) &&
    (!f.teamId || m.homeId === f.teamId || m.awayId === f.teamId))),
  match: (id) => ok(mock.matches.find((m) => m.id === id)),
  rounds: (cid) => {
    const ms = mock.matches.filter((m) => m.competitionId === cid);
    const total = ms.reduce((mx, m) => Math.max(mx, m.round), 0);
    const live = ms.find((m) => m.status !== 'finished');
    return ok({ current: live ? live.round : total, total });
  },
  standings: (cid) => ok(computeStandings(cid, mock.matches, mock.teams)),
  players: (tid) => ok(mock.players.filter((p) => p.teamId === tid)),
  player: (id) => ok(mock.players.find((p) => p.id === id)),
  topScorers: (cid, limit = 10) => ok(mock.players
    .filter((p) => !cid || mock.teams.find((t) => t.id === p.teamId)?.competitionId === cid)
    .filter((p) => p.stats.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals)
    .slice(0, limit)),
  news: () => ok(mock.news),
  newsItem: (id) => ok(mock.news.find((n) => n.id === id)),
  videos: (f = {}) => ok(mock.videos.filter((v) =>
    (!f.kind || v.kind === f.kind) && (!f.competitionId || v.competitionId === f.competitionId) && (!f.matchId || v.matchId === f.matchId))),
  products: () => ok(mock.products),
  product: (id) => ok(mock.products.find((p) => p.id === id)),
  events: () => ok(mock.events),
  event: (slug) => ok(mock.events.find((e) => e.slug === slug)),
  communiques: (f = {}) => ok(mock.communiques
    .filter((c) => !f.kind || c.kind === f.kind)
    .sort((a, b) => b.date.localeCompare(a.date))),
  partners: () => ok(mock.partners),
  search: (q) => {
    const n = q.trim().toLowerCase();
    const has = (...t: string[]) => t.some((x) => x.toLowerCase().includes(n));
    if (n.length < 2) return ok({ teams: [], players: [], news: [], communiques: [] });
    return ok({
      teams: mock.teams.filter((t) => has(t.name, t.city)).slice(0, 8),
      players: mock.players.filter((p) => has(p.name)).slice(0, 8),
      news: mock.news.filter((x) => has(x.title, x.body)),
      communiques: mock.communiques.filter((c) => has(c.title, c.body, c.kind)),
    });
  },
};

/** Sorgente attiva. Sostituire con la sorgente reale quando disponibile. */
export const data: DataSource = mockSource;
