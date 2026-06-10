import type { Goal, WCMatch } from "../types";

export type GoalRecord = {
  goal: Goal;
  team: string; // side the goal counted FOR (own goals: scorer plays for the opponent)
  opponent: string;
  match: WCMatch;
};

export type HatTrick = { name: string; team: string; goals: number; match: WCMatch };

export type TournamentStats = {
  played: number;
  totalGoals: number;
  avgGoals: number;
  penalties: number;
  ownGoals: number;
  lateGoals: number; // scored in the 90th minute or later
  fastestGoal: GoalRecord | null;
  biggestWin: WCMatch | null;
  goalFest: WCMatch | null;
  hatTricks: HatTrick[];
  cleanSheets: { team: string; count: number }[];
  topAttack: { team: string; goals: number }[];
  teamGoals: Map<string, number>;
};

function minuteKey(g: Goal): number {
  return g.minute * 100 + (g.offset ?? 0);
}

export function computeStats(matches: WCMatch[]): TournamentStats {
  const finished = matches.filter(
    (m) => m.status === "finished" && m.score1 !== null && m.score2 !== null,
  );

  const goals: GoalRecord[] = [];
  for (const m of finished) {
    for (const g of m.goals1)
      goals.push({ goal: g, team: m.team1, opponent: m.team2, match: m });
    for (const g of m.goals2)
      goals.push({ goal: g, team: m.team2, opponent: m.team1, match: m });
  }

  const totalGoals = finished.reduce(
    (s, m) => s + (m.score1 ?? 0) + (m.score2 ?? 0),
    0,
  );

  let fastestGoal: GoalRecord | null = null;
  for (const r of goals) {
    if (r.goal.minute === 0) continue; // unparsed minute
    if (!fastestGoal || minuteKey(r.goal) < minuteKey(fastestGoal.goal))
      fastestGoal = r;
  }

  let biggestWin: WCMatch | null = null;
  let goalFest: WCMatch | null = null;
  const margin = (m: WCMatch) => Math.abs((m.score1 ?? 0) - (m.score2 ?? 0));
  const total = (m: WCMatch) => (m.score1 ?? 0) + (m.score2 ?? 0);
  for (const m of finished) {
    if (margin(m) > 0 && (!biggestWin || margin(m) > margin(biggestWin)))
      biggestWin = m;
    if (total(m) > 0 && (!goalFest || total(m) > total(goalFest))) goalFest = m;
  }

  const hatTricks: HatTrick[] = [];
  for (const m of finished) {
    for (const [list, team] of [
      [m.goals1, m.team1],
      [m.goals2, m.team2],
    ] as const) {
      const perScorer = new Map<string, number>();
      for (const g of list) {
        if (g.owngoal) continue;
        perScorer.set(g.name, (perScorer.get(g.name) ?? 0) + 1);
      }
      for (const [name, n] of perScorer) {
        if (n >= 3) hatTricks.push({ name, team, goals: n, match: m });
      }
    }
  }

  const cleanSheetTally = new Map<string, number>();
  const teamGoals = new Map<string, number>();
  for (const m of finished) {
    teamGoals.set(m.team1, (teamGoals.get(m.team1) ?? 0) + (m.score1 ?? 0));
    teamGoals.set(m.team2, (teamGoals.get(m.team2) ?? 0) + (m.score2 ?? 0));
    if (m.score2 === 0)
      cleanSheetTally.set(m.team1, (cleanSheetTally.get(m.team1) ?? 0) + 1);
    if (m.score1 === 0)
      cleanSheetTally.set(m.team2, (cleanSheetTally.get(m.team2) ?? 0) + 1);
  }
  const cleanSheets = [...cleanSheetTally.entries()]
    .map(([team, count]) => ({ team, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const topAttack = [...teamGoals.entries()]
    .map(([team, goals]) => ({ team, goals }))
    .filter((t) => t.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  return {
    played: finished.length,
    totalGoals,
    avgGoals: finished.length > 0 ? totalGoals / finished.length : 0,
    penalties: goals.filter((r) => r.goal.penalty).length,
    ownGoals: goals.filter((r) => r.goal.owngoal).length,
    lateGoals: goals.filter((r) => r.goal.minute >= 90).length,
    fastestGoal,
    biggestWin,
    goalFest,
    hatTricks,
    cleanSheets,
    topAttack,
    teamGoals,
  };
}
