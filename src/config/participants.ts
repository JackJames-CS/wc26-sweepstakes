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
  { id: "aaron",   name: "Aaron",   teams: ["DR Congo", "England", "Switzerland"],           colour: "#F59E0B" },
  { id: "angela",  name: "Angela",  teams: ["Iran", "South Africa", "Spain"],                colour: "#EC4899" },
  { id: "anne",    name: "Anne",    teams: ["Australia", "France", "New Zealand"],            colour: "#FB7185" },
  { id: "barry",   name: "Barry",   teams: ["Bosnia & Herzegovina", "Portugal", "Turkey"],   colour: "#3B82F6" },
  { id: "clodagh", name: "Clodagh", teams: ["Canada", "Jordan", "Senegal"],                  colour: "#F97316" },
  { id: "dylan",   name: "Dylan",   teams: ["Colombia", "Ghana", "South Korea"],             colour: "#60A5FA" },
  { id: "emma",    name: "Emma",    teams: ["Egypt", "Netherlands", "Qatar"],                colour: "#4ADE80" },
  { id: "evan",    name: "Evan",    teams: ["Argentina", "Paraguay", "Tunisia"],             colour: "#F43F5E" },
  { id: "hannah",  name: "Hannah",  teams: ["Cape Verde", "Panama", "Uruguay"],              colour: "#EF4444" },
  { id: "jack",    name: "Jack",    teams: ["Ivory Coast", "Mexico", "Scotland"],            colour: "#8B5CF6" },
  { id: "jo",      name: "Jo",      teams: ["Algeria", "Saudi Arabia", "USA"],               colour: "#10B981" },
  { id: "keiran",  name: "Keiran",  teams: ["Croatia", "Haiti", "Norway"],                   colour: "#A855F7" },
  { id: "laura",   name: "Laura",   teams: ["Czech Republic", "Ecuador", "Morocco"],         colour: "#14B8A6" },
  { id: "mary",    name: "Mary",    teams: ["Brazil", "Curaçao", "Sweden"],                  colour: "#FBBF24" },
  { id: "shane",   name: "Shane",   teams: ["Austria", "Germany", "Uzbekistan"],             colour: "#06B6D4" },
  { id: "terry",   name: "Terry",   teams: ["Belgium", "Iraq", "Japan"],                     colour: "#84CC16" },
];

export const drawDone = participants.some((p) => p.teams.length > 0);

export function ownerOf(team: string): Participant | undefined {
  return participants.find((p) => p.teams.includes(team));
}
