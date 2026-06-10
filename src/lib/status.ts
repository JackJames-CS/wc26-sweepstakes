import type { StandingRow, TeamStatus, WCMatch } from "../types";
import { TEAMS } from "../data/teams";
import { isRealTeam } from "./parse";

// Derive each team's tournament status from fixtures + results.
// 2026 format: 12 groups of 4; top 2 + 8 best third-placed teams reach the R32.
export function computeTeamStatuses(
  matches: WCMatch[],
  standings: Map<string, StandingRow[]>,
): Map<string, TeamStatus> {
  const status = new Map<string, TeamStatus>();
  for (const t of TEAMS) status.set(t.name, "group");

  const knockoutMatches = matches.filter((m) => m.knockout);

  // Any team appearing in a knockout fixture has qualified
  for (const m of knockoutMatches) {
    for (const team of [m.team1, m.team2]) {
      if (isRealTeam(team)) status.set(team, "knockout");
    }
  }

  // R32 fully known = all 32 slots have real team names → anyone not in it is out
  const r32 = knockoutMatches.filter((m) => /32/.test(m.stage));
  const r32Known =
    r32.length > 0 && r32.every((m) => isRealTeam(m.team1) && isRealTeam(m.team2));
  if (r32Known) {
    const through = new Set<string>();
    for (const m of r32) {
      through.add(m.team1);
      through.add(m.team2);
    }
    for (const t of TEAMS) {
      if (!through.has(t.name)) status.set(t.name, "eliminated");
    }
  } else {
    // During the group stage: 4th after all 3 games can never advance;
    // a completed group's top 2 are mathematically through.
    for (const rows of standings.values()) {
      const complete = rows.every((r) => r.played >= 3);
      if (!complete) continue;
      rows.forEach((r, i) => {
        if (i <= 1) status.set(r.team, "knockout");
        if (i === 3) status.set(r.team, "eliminated");
        // 3rd place stays "group" (alive) until best-thirds are resolved
      });
    }
  }

  // Knockout losers are out
  for (const m of knockoutMatches) {
    if (m.status !== "finished" || m.score1 === null || m.score2 === null) continue;
    if (!isRealTeam(m.team1) || !isRealTeam(m.team2)) continue;
    // Note: openfootball ft score includes extra time; penalty shootouts may
    // show a draw — in that case we can't tell the winner from ft alone, skip.
    if (m.score1 === m.score2) continue;
    const winner = m.score1 > m.score2 ? m.team1 : m.team2;
    const loser = m.score1 > m.score2 ? m.team2 : m.team1;
    if (/final/i.test(m.stage) && !/semi|quarter|third/i.test(m.stage)) {
      status.set(winner, "champion");
      status.set(loser, "runnerup");
    } else {
      status.set(loser, "eliminated");
    }
  }

  return status;
}

export const STATUS_ICON: Record<TeamStatus, string> = {
  group: "🟢",
  knockout: "⭐",
  eliminated: "🔴",
  runnerup: "🥈",
  champion: "🏆",
};

export const STATUS_LABEL: Record<TeamStatus, string> = {
  group: "In the group stage",
  knockout: "Through to the knockouts",
  eliminated: "Eliminated",
  runnerup: "Runner-up",
  champion: "World champions",
};

export function isAlive(s: TeamStatus): boolean {
  return s === "group" || s === "knockout" || s === "champion";
}
