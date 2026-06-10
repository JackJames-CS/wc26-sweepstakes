// Fetch all 48 World Cup squads from ESPN into public/squads.json.
// Run manually: npm run fetch-squads
// Re-run if rosters change (injuries/replacements) — output is committed.

const LEAGUE = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world";
const BIO = (id) =>
  `https://site.web.api.espn.com/apis/common/v3/sports/soccer/fifa.world/athletes/${id}/bio`;

// ESPN names that differ from openfootball naming (mirror of src/lib/espn.ts)
const NAME_ALIASES = {
  czechia: "Czech Republic",
  "türkiye": "Turkey",
  turkiye: "Turkey",
  "cabo verde": "Cape Verde",
  "côte d'ivoire": "Ivory Coast",
  "cote d'ivoire": "Ivory Coast",
  "united states": "USA",
  "bosnia and herzegovina": "Bosnia & Herzegovina",
  "bosnia-herzegovina": "Bosnia & Herzegovina",
  "ir iran": "Iran",
  "congo dr": "DR Congo",
  "democratic republic of the congo": "DR Congo",
  "south korea": "South Korea",
  "korea republic": "South Korea",
};

// openfootball names we must end up with (sanity check)
const EXPECTED = new Set([
  "Czech Republic", "Mexico", "South Africa", "South Korea",
  "Bosnia & Herzegovina", "Canada", "Qatar", "Switzerland",
  "Brazil", "Haiti", "Morocco", "Scotland",
  "Australia", "Paraguay", "Turkey", "USA",
  "Curaçao", "Ecuador", "Germany", "Ivory Coast",
  "Japan", "Netherlands", "Sweden", "Tunisia",
  "Belgium", "Egypt", "Iran", "New Zealand",
  "Cape Verde", "Saudi Arabia", "Spain", "Uruguay",
  "France", "Iraq", "Norway", "Senegal",
  "Algeria", "Argentina", "Austria", "Jordan",
  "Colombia", "DR Congo", "Portugal", "Uzbekistan",
  "Croatia", "England", "Ghana", "Panama",
]);

async function getJson(url, attempt = 1) {
  const res = await fetch(url);
  if (!res.ok) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return getJson(url, attempt + 1);
    }
    throw new Error(`${res.status} ${url}`);
  }
  return res.json();
}

function currentClub(bio) {
  const hist = bio?.teamHistory ?? [];
  const cur = hist.find((t) => String(t.seasons ?? "").includes("CURRENT"));
  if (!cur) return { club: null, clubLogo: null };
  return { club: cur.displayName ?? null, clubLogo: cur.logo ?? null };
}

async function chunked(items, size, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  }
  return out;
}

const teamsData = await getJson(`${LEAGUE}/teams`);
const espnTeams = (teamsData.sports?.[0]?.leagues?.[0]?.teams ?? []).map(
  (t) => t.team,
);

const squads = {};
const unmatched = [];

for (const team of espnTeams) {
  const display = team.displayName ?? "";
  const name = EXPECTED.has(display)
    ? display
    : NAME_ALIASES[display.toLowerCase()];
  if (!name) {
    unmatched.push(display);
    continue;
  }

  const roster = await getJson(`${LEAGUE}/teams/${team.id}/roster`);
  const athletes = roster.athletes ?? [];

  squads[name] = await chunked(athletes, 10, async (a) => {
    let club = null;
    let clubLogo = null;
    try {
      ({ club, clubLogo } = currentClub(await getJson(BIO(a.id))));
    } catch {
      // bio missing for some players — club stays null
    }
    return {
      id: a.id,
      name: a.displayName ?? a.fullName ?? "",
      jersey: a.jersey ?? null,
      pos: a.position?.abbreviation ?? "?",
      age: a.age ?? null,
      dob: (a.dateOfBirth ?? "").slice(0, 10) || null,
      heightCm: a.height ? Math.round(a.height * 2.54) : null,
      club,
      clubLogo,
    };
  });

  console.log(`${name}: ${squads[name].length} players`);
}

if (unmatched.length) console.warn("UNMATCHED ESPN TEAMS:", unmatched);
const missing = [...EXPECTED].filter((n) => !squads[n]);
if (missing.length) console.warn("MISSING SQUADS:", missing);

const out = {
  generated: new Date().toISOString().slice(0, 10),
  squads,
};
const { writeFileSync } = await import("node:fs");
writeFileSync(
  new URL("../public/squads.json", import.meta.url),
  JSON.stringify(out),
);
console.log(
  `Wrote public/squads.json — ${Object.keys(squads).length} teams, ${Object.values(squads).reduce((n, s) => n + s.length, 0)} players`,
);
