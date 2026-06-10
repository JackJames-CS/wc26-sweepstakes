import type { WCMatch } from "../types";

// FIFA 2026 knockout tree, hardcoded by openfootball match number so the
// bracket keeps its shape after real team names replace the W-references.
// Order within each round puts feeder matches next to the match they feed.
const ROUND_ORDER: { name: string; nums: number[] }[] = [
  {
    name: "Round of 32",
    nums: [74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87],
  },
  { name: "Round of 16", nums: [89, 90, 93, 94, 91, 92, 95, 96] },
  { name: "Quarter-finals", nums: [97, 98, 99, 100] },
  { name: "Semi-finals", nums: [101, 102] },
];

export type BracketColumn = { name: string; matches: WCMatch[] };

export function buildBracket(matches: WCMatch[]): {
  columns: BracketColumn[];
  final?: WCMatch;
  thirdPlace?: WCMatch;
} {
  const ko = matches.filter((m) => m.knockout);
  const byNum = new Map<number, WCMatch>();
  for (const m of ko) if (m.num !== undefined) byNum.set(m.num, m);
  const columns = ROUND_ORDER.map((r) => ({
    name: r.name,
    matches: r.nums
      .map((n) => byNum.get(n))
      .filter((m): m is WCMatch => m !== undefined),
  })).filter((c) => c.matches.length > 0);
  const final = ko.find((m) => m.stage === "Final");
  const thirdPlace = ko.find((m) => m.stage.toLowerCase().includes("third"));
  return { columns, final, thirdPlace };
}

// null while undecided (or if the final goes to penalties — openfootball
// records the shootout winner later via team status, so don't guess here).
export function championOf(final?: WCMatch): string | null {
  if (
    !final ||
    final.status !== "finished" ||
    final.score1 === null ||
    final.score2 === null ||
    final.score1 === final.score2
  )
    return null;
  return final.score1 > final.score2 ? final.team1 : final.team2;
}
