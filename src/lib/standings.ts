import type { StandingRow, WCMatch } from "../types";
import { TEAMS } from "../data/teams";

// Group tables computed from finished group-stage matches only.
// Sort: points, goal difference, goals for, then name for stability.
export function computeStandings(matches: WCMatch[]): Map<string, StandingRow[]> {
  const rows = new Map<string, StandingRow>();
  for (const t of TEAMS) {
    rows.set(t.name, {
      team: t.name,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    });
  }

  for (const m of matches) {
    if (m.knockout || m.status !== "finished") continue;
    if (m.score1 === null || m.score2 === null) continue;
    const r1 = rows.get(m.team1);
    const r2 = rows.get(m.team2);
    if (!r1 || !r2) continue;
    r1.played++;
    r2.played++;
    r1.gf += m.score1;
    r1.ga += m.score2;
    r2.gf += m.score2;
    r2.ga += m.score1;
    if (m.score1 > m.score2) {
      r1.won++;
      r2.lost++;
      r1.pts += 3;
    } else if (m.score1 < m.score2) {
      r2.won++;
      r1.lost++;
      r2.pts += 3;
    } else {
      r1.drawn++;
      r2.drawn++;
      r1.pts++;
      r2.pts++;
    }
  }

  const groups = new Map<string, StandingRow[]>();
  for (const t of TEAMS) {
    const row = rows.get(t.name)!;
    row.gd = row.gf - row.ga;
    const list = groups.get(t.group) ?? [];
    list.push(row);
    groups.set(t.group, list);
  }
  for (const list of groups.values()) {
    list.sort(
      (a, b) =>
        b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team),
    );
  }
  return groups;
}
