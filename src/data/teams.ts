// Generated from openfootball (names, groups) + rezarahiminia/worldcup2026 (FIFA codes, flags).
// Team names match openfootball/worldcup.json exactly — participants.ts must use these names.

export type Team = {
  name: string;
  fifaCode: string;
  flag: string;
  group: string;
};

export const TEAMS: Team[] = [
  { name: "Czech Republic", fifaCode: "CZE", flag: "https://flagcdn.com/w80/cz.png", group: "A" },
  { name: "Mexico", fifaCode: "MEX", flag: "https://flagcdn.com/w80/mx.png", group: "A" },
  { name: "South Africa", fifaCode: "RSA", flag: "https://flagcdn.com/w80/za.png", group: "A" },
  { name: "South Korea", fifaCode: "KOR", flag: "https://flagcdn.com/w80/kr.png", group: "A" },
  { name: "Bosnia & Herzegovina", fifaCode: "BIH", flag: "https://flagcdn.com/w80/ba.png", group: "B" },
  { name: "Canada", fifaCode: "CAN", flag: "https://flagcdn.com/w80/ca.png", group: "B" },
  { name: "Qatar", fifaCode: "QAT", flag: "https://flagcdn.com/w80/qa.png", group: "B" },
  { name: "Switzerland", fifaCode: "SUI", flag: "https://flagcdn.com/w80/ch.png", group: "B" },
  { name: "Brazil", fifaCode: "BRA", flag: "https://flagcdn.com/w80/br.png", group: "C" },
  { name: "Haiti", fifaCode: "HAI", flag: "https://flagcdn.com/w80/ht.png", group: "C" },
  { name: "Morocco", fifaCode: "MAR", flag: "https://flagcdn.com/w80/ma.png", group: "C" },
  { name: "Scotland", fifaCode: "SCO", flag: "https://flagcdn.com/w80/gb-sct.png", group: "C" },
  { name: "Australia", fifaCode: "AUS", flag: "https://flagcdn.com/w80/au.png", group: "D" },
  { name: "Paraguay", fifaCode: "PAR", flag: "https://flagcdn.com/w80/py.png", group: "D" },
  { name: "Turkey", fifaCode: "TUR", flag: "https://flagcdn.com/w80/tr.png", group: "D" },
  { name: "USA", fifaCode: "USA", flag: "https://flagcdn.com/w80/us.png", group: "D" },
  { name: "Curaçao", fifaCode: "CUW", flag: "https://flagcdn.com/w80/cw.png", group: "E" },
  { name: "Ecuador", fifaCode: "ECU", flag: "https://flagcdn.com/w80/ec.png", group: "E" },
  { name: "Germany", fifaCode: "GER", flag: "https://flagcdn.com/w80/de.png", group: "E" },
  { name: "Ivory Coast", fifaCode: "CIV", flag: "https://flagcdn.com/w80/ci.png", group: "E" },
  { name: "Japan", fifaCode: "JPN", flag: "https://flagcdn.com/w80/jp.png", group: "F" },
  { name: "Netherlands", fifaCode: "NED", flag: "https://flagcdn.com/w80/nl.png", group: "F" },
  { name: "Sweden", fifaCode: "SWE", flag: "https://flagcdn.com/w80/se.png", group: "F" },
  { name: "Tunisia", fifaCode: "TUN", flag: "https://flagcdn.com/w80/tn.png", group: "F" },
  { name: "Belgium", fifaCode: "BEL", flag: "https://flagcdn.com/w80/be.png", group: "G" },
  { name: "Egypt", fifaCode: "EGY", flag: "https://flagcdn.com/w80/eg.png", group: "G" },
  { name: "Iran", fifaCode: "IRN", flag: "https://flagcdn.com/w80/ir.png", group: "G" },
  { name: "New Zealand", fifaCode: "NZL", flag: "https://flagcdn.com/w80/nz.png", group: "G" },
  { name: "Cape Verde", fifaCode: "CPV", flag: "https://flagcdn.com/w80/cv.png", group: "H" },
  { name: "Saudi Arabia", fifaCode: "KSA", flag: "https://flagcdn.com/w80/sa.png", group: "H" },
  { name: "Spain", fifaCode: "ESP", flag: "https://flagcdn.com/w80/es.png", group: "H" },
  { name: "Uruguay", fifaCode: "URU", flag: "https://flagcdn.com/w80/uy.png", group: "H" },
  { name: "France", fifaCode: "FRA", flag: "https://flagcdn.com/w80/fr.png", group: "I" },
  { name: "Iraq", fifaCode: "IRQ", flag: "https://flagcdn.com/w80/iq.png", group: "I" },
  { name: "Norway", fifaCode: "NOR", flag: "https://flagcdn.com/w80/no.png", group: "I" },
  { name: "Senegal", fifaCode: "SEN", flag: "https://flagcdn.com/w80/sn.png", group: "I" },
  { name: "Algeria", fifaCode: "ALG", flag: "https://flagcdn.com/w80/dz.png", group: "J" },
  { name: "Argentina", fifaCode: "ARG", flag: "https://flagcdn.com/w80/ar.png", group: "J" },
  { name: "Austria", fifaCode: "AUT", flag: "https://flagcdn.com/w80/at.png", group: "J" },
  { name: "Jordan", fifaCode: "JOR", flag: "https://flagcdn.com/w80/jo.png", group: "J" },
  { name: "Colombia", fifaCode: "COL", flag: "https://flagcdn.com/w80/co.png", group: "K" },
  { name: "DR Congo", fifaCode: "COD", flag: "https://flagcdn.com/w80/cd.png", group: "K" },
  { name: "Portugal", fifaCode: "POR", flag: "https://flagcdn.com/w80/pt.png", group: "K" },
  { name: "Uzbekistan", fifaCode: "UZB", flag: "https://flagcdn.com/w80/uz.png", group: "K" },
  { name: "Croatia", fifaCode: "CRO", flag: "https://flagcdn.com/w80/hr.png", group: "L" },
  { name: "England", fifaCode: "ENG", flag: "https://flagcdn.com/w80/gb-eng.png", group: "L" },
  { name: "Ghana", fifaCode: "GHA", flag: "https://flagcdn.com/w80/gh.png", group: "L" },
  { name: "Panama", fifaCode: "PAN", flag: "https://flagcdn.com/w80/pa.png", group: "L" },
];

export const TEAM_BY_NAME = new Map(TEAMS.map((t) => [t.name, t]));
export const TEAM_BY_CODE = new Map(TEAMS.map((t) => [t.fifaCode, t]));
