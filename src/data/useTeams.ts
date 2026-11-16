import { data } from './source';
import type { Team } from './types';
import { useData } from './useData';

/** Mappa id → squadra, per mostrare nomi e sigle nelle card delle partite. */
export function useTeamMap() {
  const { value } = useData(() => data.teams());
  const map: Record<string, Team> = {};
  (value ?? []).forEach((t) => { map[t.id] = t; });
  return map;
}
