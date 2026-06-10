import type { Goal, SquadPlayer, WCMatch } from "../types";

export const POS_ORDER = ["G", "D", "M", "F"] as const;

export const POS_LABEL: Record<string, string> = {
  G: "Goalkeepers",
  D: "Defenders",
  M: "Midfielders",
  F: "Forwards",
};

export const POS_NAME: Record<string, string> = {
  G: "Goalkeeper",
  D: "Defender",
  M: "Midfielder",
  F: "Forward",
};

export function groupByPosition(
  squad: SquadPlayer[],
): [string, SquadPlayer[]][] {
  const byPos = new Map<string, SquadPlayer[]>();
  for (const p of squad) {
    const list = byPos.get(p.pos) ?? [];
    list.push(p);
    byPos.set(p.pos, list);
  }
  const order = [...POS_ORDER, ...byPos.keys()].filter(
    (pos, i, all) => all.indexOf(pos) === i && byPos.has(pos),
  );
  return order.map((pos) => [
    pos,
    byPos.get(pos)!.sort((a, b) => Number(a.jersey ?? 99) - Number(b.jersey ?? 99)),
  ]);
}

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.\-']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// openfootball scorer names are shorter than ESPN full names ("Mbappé" vs
// "Kylian Mbappé"), so match on surname with first-initial compatibility.
export function scorerMatchesPlayer(scorer: string, player: string): boolean {
  const a = norm(scorer);
  const b = norm(player);
  if (a === b) return true;
  const at = a.split(" ");
  const bt = b.split(" ");
  if (at[at.length - 1] !== bt[bt.length - 1]) return false;
  if (at.length === 1) return true;
  return at[0][0] === bt[0][0];
}

export type PlayerGoal = {
  match: WCMatch;
  opponent: string;
  goal: Goal;
};

export function goalsForPlayer(
  matches: WCMatch[],
  team: string,
  player: SquadPlayer,
): PlayerGoal[] {
  const out: PlayerGoal[] = [];
  for (const m of matches) {
    if (m.status === "scheduled") continue;
    const sides: [Goal[], string][] =
      m.team1 === team
        ? [[m.goals1, m.team2]]
        : m.team2 === team
          ? [[m.goals2, m.team1]]
          : [];
    for (const [goals, opponent] of sides) {
      for (const g of goals) {
        if (g.owngoal) continue;
        if (scorerMatchesPlayer(g.name, player.name)) {
          out.push({ match: m, opponent, goal: g });
        }
      }
    }
  }
  return out;
}
