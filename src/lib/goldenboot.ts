import type { WCMatch } from "../types";

export type Scorer = { name: string; team: string; goals: number };

// Aggregate goalscorers from openfootball match data (own goals excluded).
export function computeGoldenBoot(matches: WCMatch[], top = 8): Scorer[] {
  const tally = new Map<string, Scorer>();
  for (const m of matches) {
    if (m.status !== "finished") continue;
    for (const [goals, team] of [
      [m.goals1, m.team1],
      [m.goals2, m.team2],
    ] as const) {
      for (const g of goals) {
        if (g.owngoal) continue;
        const key = `${g.name}|${team}`;
        const s = tally.get(key) ?? { name: g.name, team, goals: 0 };
        s.goals++;
        tally.set(key, s);
      }
    }
  }
  return [...tally.values()].sort((a, b) => b.goals - a.goals).slice(0, top);
}
