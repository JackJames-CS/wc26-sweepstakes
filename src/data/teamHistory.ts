// Static World Cup history for every 2026 team, keyed by FIFA code.
// Written once before the tournament — never needs updating during it.
// `appearances` includes 2026. Predecessor nations count (Czechoslovakia → Czech
// Republic, Zaire → DR Congo, West Germany → Germany).

export type TeamHistory = {
  appearances: number;
  titles: number[];
  bestFinish: string;
  lastTournament: string;
  flavour: string;
};

export const TEAM_HISTORY: Record<string, TeamHistory> = {
  // ── Group A ──
  CZE: {
    appearances: 9,
    titles: [],
    bestFinish: "Runners-up 1934, 1962 (as Czechoslovakia)",
    lastTournament: "1990 — QF (lost 1–0 to West Germany)",
    flavour: "Two-time finalists as Czechoslovakia — this is their first World Cup as an independent nation.",
  },
  MEX: {
    appearances: 18,
    titles: [],
    bestFinish: "Quarter-finals 1970, 1986 (both as hosts)",
    lastTournament: "2022 — group stage (first group exit since 1978)",
    flavour: "Co-hosts — and eternally stuck at the round of 16: seven straight exits there from 1994 to 2018.",
  },
  RSA: {
    appearances: 4,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2010 — group stage (hosts)",
    flavour: "Tshabalala's screamer opened the 2010 World Cup — but Bafana Bafana became the first hosts ever to exit in the groups.",
  },
  KOR: {
    appearances: 12,
    titles: [],
    bestFinish: "Fourth place 2002 (co-hosts)",
    lastTournament: "2022 — R16 (lost 4–1 to Brazil)",
    flavour: "The 2002 semi-final run remains Asia's best-ever World Cup finish.",
  },

  // ── Group B ──
  BIH: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2014 — group stage (beat Iran; narrow losses to Argentina and Nigeria)",
    flavour: "Back for a second World Cup after the Džeko generation's 2014 debut.",
  },
  CAN: {
    appearances: 3,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2022 — group stage (Alphonso Davies scored their first-ever World Cup goal)",
    flavour: "Co-hosts chasing a first-ever World Cup win at the third attempt.",
  },
  QAT: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2022 — group stage (hosts)",
    flavour: "In 2022 they became the first host nation to lose their opening match — and all three games.",
  },
  SUI: {
    appearances: 13,
    titles: [],
    bestFinish: "Quarter-finals 1934, 1938, 1954 (hosts)",
    lastTournament: "2022 — R16 (lost 6–1 to Portugal)",
    flavour: "Reliably reach the knockouts, reliably stop there — no quarter-final since hosting in 1954.",
  },

  // ── Group C ──
  BRA: {
    appearances: 23,
    titles: [1958, 1962, 1970, 1994, 2002],
    bestFinish: "Winners (5×)",
    lastTournament: "2022 — QF (lost to Croatia on pens)",
    flavour: "The most successful nation in World Cup history — and the only one to play in every single tournament.",
  },
  HAI: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "1974 — group stage",
    flavour: "In 1974, Emmanuel Sanon ended Dino Zoff's 1,142-minute shutout streak. First World Cup since.",
  },
  MAR: {
    appearances: 7,
    titles: [],
    bestFinish: "Fourth place 2022",
    lastTournament: "2022 — fourth place (beat Spain and Portugal en route)",
    flavour: "The first African and Arab nation ever to reach a World Cup semi-final.",
  },
  SCO: {
    appearances: 9,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "1998 — group stage",
    flavour: "Eight World Cups, zero knockout games — in 1974 they went home unbeaten. Surely this time.",
  },

  // ── Group D ──
  AUS: {
    appearances: 7,
    titles: [],
    bestFinish: "Round of 16 (2006, 2022)",
    lastTournament: "2022 — R16 (lost 2–1 to eventual champions Argentina)",
    flavour: "The Socceroos' 2022 run was their best yet — two wins in a group stage for the first time.",
  },
  PAR: {
    appearances: 9,
    titles: [],
    bestFinish: "Quarter-finals 2010",
    lastTournament: "2010 — QF (lost 1–0 to eventual champions Spain)",
    flavour: "First World Cup since 2010 — La Albirroja are back after a 16-year wait.",
  },
  TUR: {
    appearances: 3,
    titles: [],
    bestFinish: "Third place 2002",
    lastTournament: "2002 — third place",
    flavour: "Hakan Şükür's 11-second strike in 2002 is still the fastest World Cup goal ever.",
  },
  USA: {
    appearances: 12,
    titles: [],
    bestFinish: "Semi-finals 1930 (third place)",
    lastTournament: "2022 — R16 (lost 3–1 to the Netherlands)",
    flavour: "Hosts — and authors of the 1950 'Miracle on Grass', beating England 1–0.",
  },

  // ── Group E ──
  CUW: {
    appearances: 1,
    titles: [],
    bestFinish: "Debut",
    lastTournament: "First appearance",
    flavour: "The smallest nation ever to qualify for a World Cup — population about 150,000.",
  },
  ECU: {
    appearances: 5,
    titles: [],
    bestFinish: "Round of 16 2006",
    lastTournament: "2022 — group stage (Enner Valencia scored all three of their goals)",
    flavour: "Scored the first goal of the 2022 World Cup — Valencia against the hosts.",
  },
  GER: {
    appearances: 21,
    titles: [1954, 1974, 1990, 2014],
    bestFinish: "Winners (4×)",
    lastTournament: "2022 — group stage (second consecutive group exit)",
    flavour: "Four titles and eight finals — but two straight group-stage exits to atone for.",
  },
  CIV: {
    appearances: 4,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2014 — group stage (last-minute penalty heartbreak vs Greece)",
    flavour: "Drogba's golden generation kept drawing groups of death — the Elephants have never escaped one.",
  },

  // ── Group F ──
  JPN: {
    appearances: 8,
    titles: [],
    bestFinish: "Round of 16 (4×)",
    lastTournament: "2022 — R16 (lost to Croatia on pens)",
    flavour: "Beat both Germany AND Spain in the 2022 groups — the round of 16 wall still won't budge.",
  },
  NED: {
    appearances: 12,
    titles: [],
    bestFinish: "Runners-up 1974, 1978, 2010",
    lastTournament: "2022 — QF (lost to Argentina on pens)",
    flavour: "Three finals, zero titles — the best team never to win the World Cup.",
  },
  SWE: {
    appearances: 13,
    titles: [],
    bestFinish: "Runners-up 1958 (hosts)",
    lastTournament: "2018 — QF (lost 2–0 to England)",
    flavour: "First World Cup since 2018 — and the post-Zlatan era's biggest stage yet.",
  },
  TUN: {
    appearances: 7,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2022 — group stage (beat champions France 1–0 and still went out)",
    flavour: "In 1978 they became the first African side ever to win a World Cup match.",
  },

  // ── Group G ──
  BEL: {
    appearances: 15,
    titles: [],
    bestFinish: "Third place 2018",
    lastTournament: "2022 — group stage",
    flavour: "The golden generation peaked at third in 2018 — now it's the next wave's turn.",
  },
  EGY: {
    appearances: 4,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2018 — group stage",
    flavour: "Africa's first-ever World Cup team (1934) — still waiting for a first knockout appearance.",
  },
  IRN: {
    appearances: 7,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2022 — group stage (lost the decider to the USA)",
    flavour: "Six tries, no knockouts — but the 1998 win over the USA is World Cup folklore.",
  },
  NZL: {
    appearances: 3,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2010 — group stage",
    flavour: "Unbeaten at the 2010 World Cup — three draws — and still went home. The only unbeaten team that year.",
  },

  // ── Group H ──
  CPV: {
    appearances: 1,
    titles: [],
    bestFinish: "Debut",
    lastTournament: "First appearance",
    flavour: "Islands of half a million people, now at a World Cup — one of the smallest nations ever to make it.",
  },
  KSA: {
    appearances: 7,
    titles: [],
    bestFinish: "Round of 16 1994",
    lastTournament: "2022 — group stage (beat eventual champions Argentina 2–1)",
    flavour: "Authors of the biggest shock of 2022 — and of Al-Owairan's 1994 wonder goal.",
  },
  ESP: {
    appearances: 17,
    titles: [2010],
    bestFinish: "Winners 2010",
    lastTournament: "2022 — R16 (lost to Morocco on pens)",
    flavour: "Reigning European champions hunting a second star, with the deepest midfield pool on earth.",
  },
  URU: {
    appearances: 15,
    titles: [1930, 1950],
    bestFinish: "Winners (2×)",
    lastTournament: "2022 — group stage (out on goals scored)",
    flavour: "The first-ever world champions — and the 1950 Maracanazo remains football's greatest upset.",
  },

  // ── Group I ──
  FRA: {
    appearances: 17,
    titles: [1998, 2018],
    bestFinish: "Winners (2×)",
    lastTournament: "2022 — runners-up (lost the final to Argentina on pens despite an Mbappé hat-trick)",
    flavour: "Finalists in three of the last four World Cups — the tournament's modern superpower.",
  },
  IRQ: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "1986 — group stage (all three defeats by a single goal)",
    flavour: "First World Cup in 40 years — the Lions of Mesopotamia return.",
  },
  NOR: {
    appearances: 4,
    titles: [],
    bestFinish: "Round of 16 1998",
    lastTournament: "1998 — R16 (lost 1–0 to Italy)",
    flavour: "Beat Brazil in 1998, then vanished for 28 years — back at last, with Haaland.",
  },
  SEN: {
    appearances: 4,
    titles: [],
    bestFinish: "Quarter-finals 2002",
    lastTournament: "2022 — R16 (lost 3–0 to England)",
    flavour: "Stunned holders France in their first-ever World Cup match in 2002, then reached the quarters.",
  },

  // ── Group J ──
  ALG: {
    appearances: 5,
    titles: [],
    bestFinish: "Round of 16 2014",
    lastTournament: "2014 — R16 (took eventual champions Germany to extra time)",
    flavour: "Beat West Germany in 1982, only to be eliminated by the 'Disgrace of Gijón' stitch-up.",
  },
  ARG: {
    appearances: 19,
    titles: [1978, 1986, 2022],
    bestFinish: "Winners (3×)",
    lastTournament: "2022 — CHAMPIONS (beat France on pens in an all-time final)",
    flavour: "Defending champions. Messi's coronation in Qatar settled the GOAT debate for half the planet.",
  },
  AUT: {
    appearances: 8,
    titles: [],
    bestFinish: "Third place 1954",
    lastTournament: "1998 — group stage",
    flavour: "The 1930s Wunderteam and a 1954 semi-final are the history — this is their first World Cup since 1998.",
  },
  JOR: {
    appearances: 1,
    titles: [],
    bestFinish: "Debut",
    lastTournament: "First appearance",
    flavour: "Asian Cup finalists in 2024, World Cup debutants in 2026 — Jordan's golden age is now.",
  },

  // ── Group K ──
  COL: {
    appearances: 7,
    titles: [],
    bestFinish: "Quarter-finals 2014",
    lastTournament: "2018 — R16 (lost to England on pens)",
    flavour: "James Rodríguez won the 2014 Golden Boot — Colombia's first World Cup since 2018.",
  },
  COD: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "1974 — group stage (as Zaire)",
    flavour: "As Zaire in 1974, the first sub-Saharan African team at a World Cup. Back after 52 years.",
  },
  POR: {
    appearances: 9,
    titles: [],
    bestFinish: "Third place 1966",
    lastTournament: "2022 — QF (lost 1–0 to Morocco)",
    flavour: "Eusébio's 1966 semi-final run is still the high-water mark — the Ronaldo era seeks a first crown.",
  },
  UZB: {
    appearances: 1,
    titles: [],
    bestFinish: "Debut",
    lastTournament: "First appearance",
    flavour: "The first Central Asian nation ever to qualify for a World Cup.",
  },

  // ── Group L ──
  CRO: {
    appearances: 7,
    titles: [],
    bestFinish: "Runners-up 2018",
    lastTournament: "2022 — third place (knocked out Brazil on pens en route)",
    flavour: "A nation of four million with a final and two bronzes in the last three World Cups.",
  },
  ENG: {
    appearances: 17,
    titles: [1966],
    bestFinish: "Winners 1966 (hosts)",
    lastTournament: "2022 — QF (lost 2–1 to France)",
    flavour: "Sixty years of hurt. It's still never come home since 1966.",
  },
  GHA: {
    appearances: 5,
    titles: [],
    bestFinish: "Quarter-finals 2010",
    lastTournament: "2022 — group stage",
    flavour: "One missed penalty from being Africa's first semi-finalist in 2010 — after THAT Suárez handball.",
  },
  PAN: {
    appearances: 2,
    titles: [],
    bestFinish: "Group stage",
    lastTournament: "2018 — group stage",
    flavour: "Felipe Baloy's 2018 strike — their first-ever World Cup goal — was celebrated like a title back home.",
  },
};

// ── Head-to-head: notable World Cup meetings only ──
// Keyed by the two FIFA codes sorted alphabetically and joined with "_".
// Not exhaustive — just the spicy ones (per the design note).

export type H2HMeeting = {
  year: number;
  stage: string;
  result: string;
};

export type H2H = {
  meetings: H2HMeeting[];
  summary: string;
};

export function h2hKey(codeA: string, codeB: string): string {
  return [codeA, codeB].sort().join("_");
}

export function getH2H(codeA: string, codeB: string): H2H | undefined {
  return H2H_RECORDS[h2hKey(codeA, codeB)];
}

export const H2H_RECORDS: Record<string, H2H> = {
  // Same-group fixtures (these WILL happen)
  BRA_SCO: {
    meetings: [
      { year: 1974, stage: "Group", result: "Brazil 0–0 Scotland" },
      { year: 1982, stage: "Group", result: "Brazil 4–1 Scotland" },
      { year: 1990, stage: "Group", result: "Brazil 1–0 Scotland" },
      { year: 1998, stage: "Group (opening match)", result: "Brazil 2–1 Scotland" },
    ],
    summary: "Brazil 3 wins | Draws 1 | Scotland 0 wins",
  },
  MAR_SCO: {
    meetings: [
      { year: 1998, stage: "Group", result: "Morocco 3–0 Scotland" },
    ],
    summary: "Morocco 1 win | Scotland 0 wins — that defeat sent Scotland home",
  },
  ENG_PAN: {
    meetings: [
      { year: 2018, stage: "Group", result: "England 6–1 Panama" },
    ],
    summary: "England's record World Cup win",
  },
  FRA_SEN: {
    meetings: [
      { year: 2002, stage: "Group (opening match)", result: "Senegal 1–0 France" },
    ],
    summary: "Debutants Senegal beat the holders in one of the great World Cup shocks",
  },
  ALG_AUT: {
    meetings: [
      { year: 1982, stage: "Group", result: "Austria 2–0 Algeria" },
    ],
    summary: "From the 1982 tournament of the 'Disgrace of Gijón' that eliminated Algeria",
  },
  KOR_MEX: {
    meetings: [
      { year: 1998, stage: "Group", result: "Mexico 3–1 South Korea" },
      { year: 2018, stage: "Group", result: "Mexico 2–1 South Korea" },
    ],
    summary: "Mexico 2 wins | South Korea 0 wins",
  },

  // Classics (possible knockout meetings)
  ENG_GER: {
    meetings: [
      { year: 1966, stage: "Final", result: "England 4–2 West Germany (aet)" },
      { year: 1970, stage: "QF", result: "West Germany 3–2 England (aet)" },
      { year: 1990, stage: "SF", result: "1–1, West Germany won on pens" },
      { year: 2010, stage: "R16", result: "Germany 4–1 England" },
    ],
    summary: "England 1 win | Germany 3 wins (incl. pens)",
  },
  ARG_ENG: {
    meetings: [
      { year: 1966, stage: "QF", result: "England 1–0 Argentina" },
      { year: 1986, stage: "QF", result: "Argentina 2–1 England (Hand of God + Goal of the Century)" },
      { year: 1998, stage: "R16", result: "2–2, Argentina won on pens (Beckham sent off)" },
      { year: 2002, stage: "Group", result: "England 1–0 Argentina (Beckham penalty)" },
    ],
    summary: "England 2 wins | Argentina 2 wins (incl. pens)",
  },
  ARG_FRA: {
    meetings: [
      { year: 1978, stage: "Group", result: "Argentina 2–1 France" },
      { year: 2018, stage: "R16", result: "France 4–3 Argentina" },
      { year: 2022, stage: "Final", result: "3–3, Argentina won on pens (Mbappé hat-trick in defeat)" },
    ],
    summary: "Argentina 2 wins (incl. pens) | France 1 win",
  },
  ARG_GER: {
    meetings: [
      { year: 1986, stage: "Final", result: "Argentina 3–2 West Germany" },
      { year: 1990, stage: "Final", result: "West Germany 1–0 Argentina" },
      { year: 2006, stage: "QF", result: "1–1, Germany won on pens" },
      { year: 2010, stage: "QF", result: "Germany 4–0 Argentina" },
      { year: 2014, stage: "Final", result: "Germany 1–0 Argentina (aet)" },
    ],
    summary: "Argentina 1 win | Germany 4 wins (incl. pens) — three finals between them",
  },
  BRA_GER: {
    meetings: [
      { year: 2002, stage: "Final", result: "Brazil 2–0 Germany" },
      { year: 2014, stage: "SF", result: "Germany 7–1 Brazil" },
    ],
    summary: "One title each way — one of them by SEVEN",
  },
  BRA_FRA: {
    meetings: [
      { year: 1958, stage: "SF", result: "Brazil 5–2 France (Pelé hat-trick, aged 17)" },
      { year: 1986, stage: "QF", result: "1–1, France won on pens" },
      { year: 1998, stage: "Final", result: "France 3–0 Brazil" },
      { year: 2006, stage: "QF", result: "France 1–0 Brazil (the Zidane masterclass)" },
    ],
    summary: "Brazil 1 win | France 3 wins (incl. pens)",
  },
  FRA_GER: {
    meetings: [
      { year: 1982, stage: "SF", result: "3–3, West Germany won on pens (the Schumacher–Battiston night)" },
      { year: 1986, stage: "SF", result: "West Germany 2–0 France" },
      { year: 2014, stage: "QF", result: "Germany 1–0 France" },
    ],
    summary: "France 0 wins | Germany 3 wins (incl. pens)",
  },
  ARG_NED: {
    meetings: [
      { year: 1974, stage: "Second round", result: "Netherlands 4–0 Argentina" },
      { year: 1978, stage: "Final", result: "Argentina 3–1 Netherlands (aet)" },
      { year: 1998, stage: "QF", result: "Netherlands 2–1 Argentina (THAT Bergkamp touch)" },
      { year: 2014, stage: "SF", result: "0–0, Argentina won on pens" },
      { year: 2022, stage: "QF", result: "2–2, Argentina won on pens (14 yellow cards)" },
    ],
    summary: "Argentina 3 wins (incl. pens) | Netherlands 2 wins",
  },
  GER_NED: {
    meetings: [
      { year: 1974, stage: "Final", result: "West Germany 2–1 Netherlands" },
      { year: 1990, stage: "R16", result: "West Germany 2–1 Netherlands (Rijkaard–Völler spitting incident)" },
    ],
    summary: "Germany 2 wins | Netherlands 0 wins — football's bitterest rivalry",
  },
  GHA_URU: {
    meetings: [
      { year: 2010, stage: "QF", result: "1–1, Uruguay won on pens (Suárez handball on the line, Gyan hit the bar)" },
      { year: 2022, stage: "Group", result: "Uruguay 2–0 Ghana (both eliminated anyway)" },
    ],
    summary: "Uruguay 2 wins (incl. pens) | Ghana 0 wins — Ghana still wants revenge",
  },
  ESP_MAR: {
    meetings: [
      { year: 2018, stage: "Group", result: "Spain 2–2 Morocco" },
      { year: 2022, stage: "R16", result: "0–0, Morocco won on pens" },
    ],
    summary: "Morocco 1 win (pens) | Draws 1 | Spain 0 wins",
  },
  MAR_POR: {
    meetings: [
      { year: 1986, stage: "Group", result: "Morocco 3–1 Portugal" },
      { year: 2022, stage: "QF", result: "Morocco 1–0 Portugal" },
    ],
    summary: "Morocco 2 wins | Portugal 0 wins",
  },
  BRA_CRO: {
    meetings: [
      { year: 2006, stage: "Group", result: "Brazil 1–0 Croatia" },
      { year: 2014, stage: "Group (opening match)", result: "Brazil 3–1 Croatia" },
      { year: 2022, stage: "QF", result: "1–1, Croatia won on pens" },
    ],
    summary: "Brazil 2 wins | Croatia 1 win (pens)",
  },
  CRO_ENG: {
    meetings: [
      { year: 2018, stage: "SF", result: "Croatia 2–1 England (aet)" },
    ],
    summary: "Croatia ended the 'it's coming home' summer",
  },
  GER_JPN: {
    meetings: [
      { year: 2022, stage: "Group", result: "Japan 2–1 Germany" },
    ],
    summary: "The upset that started Germany's 2022 collapse",
  },
};
