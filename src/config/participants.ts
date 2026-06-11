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
  { id: "barry",   name: "Barry",   teams: ["Canada", "Germany", "Cape Verde"],                       colour: "#3B82F6" },
  { id: "jo",      name: "Jo",      teams: ["Qatar", "Haiti", "Ghana"],                               colour: "#10B981" },
  { id: "aaron",   name: "Aaron",   teams: ["Belgium", "Saudi Arabia", "Turkey", "Egypt"],            colour: "#F59E0B" },
  { id: "jack",    name: "Jack",    teams: ["Japan", "Austria", "Spain"],                             colour: "#8B5CF6" },
  { id: "hannah",  name: "Hannah",  teams: ["Portugal", "Panama", "Brazil", "Netherlands"],           colour: "#EF4444" },
  { id: "shane",   name: "Shane",   teams: ["Scotland", "Iraq", "USA", "Norway"],                     colour: "#06B6D4" },
  { id: "angela",  name: "Angela",  teams: ["Paraguay", "Argentina", "Tunisia", "Iran"],              colour: "#EC4899" },
  { id: "terry",   name: "Terry",   teams: ["Czech Republic", "Ecuador", "Curaçao"],                  colour: "#84CC16" },
  { id: "clodagh", name: "Clodagh", teams: ["Sweden", "England", "New Zealand"],                      colour: "#F97316" },
  { id: "keiran",  name: "Keiran",  teams: ["Colombia", "Australia", "Uruguay", "Mexico"],            colour: "#A855F7" },
  { id: "laura",   name: "Laura",   teams: ["Algeria", "DR Congo", "Bosnia & Herzegovina", "South Korea"], colour: "#14B8A6" },
  { id: "anne",    name: "Anne",    teams: ["Senegal", "Ivory Coast", "Uzbekistan"],                  colour: "#FB7185" },
  { id: "granny",  name: "Granny",  teams: ["France", "Switzerland", "South Africa"],                 colour: "#FBBF24" },
  { id: "emma",    name: "Emma",    teams: ["Morocco", "Jordan", "Croatia"],                          colour: "#4ADE80" },
  // Dylan TBC — if he joins, expanding to 16 players means 3 teams each:
  // { id: "dylan", name: "Dylan", teams: [], colour: "#60A5FA" },
];

export const drawDone = participants.some((p) => p.teams.length > 0);

export function ownerOf(team: string): Participant | undefined {
  return participants.find((p) => p.teams.includes(team));
}
