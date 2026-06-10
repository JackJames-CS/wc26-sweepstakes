export type Participant = {
  id: string;
  name: string;
  // Full team names exactly as they appear in src/data/teams.ts
  // (openfootball naming, e.g. "Czech Republic" not "Czechia").
  // Fill these in once the draw happens — the whole app derives from this file.
  teams: string[];
  colour: string;
};

export const participants: Participant[] = [
  { id: "barry", name: "Barry", teams: [], colour: "#3B82F6" },
  { id: "jo", name: "Jo", teams: [], colour: "#10B981" },
  { id: "aaron", name: "Aaron", teams: [], colour: "#F59E0B" },
  { id: "jack", name: "Jack", teams: [], colour: "#8B5CF6" },
  { id: "hannah", name: "Hannah", teams: [], colour: "#EF4444" },
  { id: "shane", name: "Shane", teams: [], colour: "#06B6D4" },
  { id: "angela", name: "Angela", teams: [], colour: "#EC4899" },
  { id: "terry", name: "Terry", teams: [], colour: "#84CC16" },
  { id: "clodagh", name: "Clodagh", teams: [], colour: "#F97316" },
  { id: "keiran", name: "Keiran", teams: [], colour: "#A855F7" },
  { id: "laura", name: "Laura", teams: [], colour: "#14B8A6" },
  { id: "anne", name: "Anne", teams: [], colour: "#FB7185" },
  { id: "granny", name: "Granny", teams: [], colour: "#FBBF24" },
  { id: "emma", name: "Emma", teams: [], colour: "#4ADE80" },
  // Dylan TBC — if he joins, expanding to 16 players means 3 teams each:
  // { id: "dylan", name: "Dylan", teams: [], colour: "#60A5FA" },
];

export const drawDone = participants.some((p) => p.teams.length > 0);

export function ownerOf(team: string): Participant | undefined {
  return participants.find((p) => p.teams.includes(team));
}
