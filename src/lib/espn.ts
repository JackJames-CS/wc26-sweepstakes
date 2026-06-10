import type { EspnEvent, WCMatch } from "../types";
import { TEAM_BY_CODE, TEAM_BY_NAME } from "../data/teams";

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

// ESPN names that differ from openfootball naming
const ESPN_NAME_ALIASES: Record<string, string> = {
  czechia: "Czech Republic",
  "türkiye": "Turkey",
  turkiye: "Turkey",
  "cabo verde": "Cape Verde",
  "côte d'ivoire": "Ivory Coast",
  "cote d'ivoire": "Ivory Coast",
  "united states": "USA",
  "bosnia and herzegovina": "Bosnia & Herzegovina",
  "ir iran": "Iran",
  "congo dr": "DR Congo",
  "democratic republic of the congo": "DR Congo",
  "south korea": "South Korea",
  "korea republic": "South Korea",
};

function resolveTeamName(code: string, displayName: string): string | null {
  const byCode = TEAM_BY_CODE.get(code);
  if (byCode) return byCode.name;
  if (TEAM_BY_NAME.has(displayName)) return displayName;
  return ESPN_NAME_ALIASES[displayName.toLowerCase()] ?? null;
}

export async function fetchEspnScoreboard(): Promise<EspnEvent[]> {
  const res = await fetch(ESPN_URL);
  if (!res.ok) throw new Error(`espn fetch failed: ${res.status}`);
  const data = await res.json();
  const events: EspnEvent[] = [];
  for (const e of data.events ?? []) {
    const comp = e.competitions?.[0];
    if (!comp) continue;
    const state = comp.status?.type?.state;
    if (state !== "pre" && state !== "in" && state !== "post") continue;
    const teams = (comp.competitors ?? []).map(
      (c: { team: { abbreviation?: string; displayName?: string }; score?: string }) => ({
        code: c.team?.abbreviation ?? "",
        name: c.team?.displayName ?? "",
        score: Number(c.score ?? 0),
      }),
    );
    if (teams.length !== 2) continue;
    events.push({
      utcDate: (e.date ?? "").slice(0, 10),
      state,
      clock: comp.status?.displayClock ?? "",
      teams,
    });
  }
  return events;
}

function pairKey(a: string, b: string, day: string): string {
  return [a, b].sort().join("|") + "|" + day;
}

// Overlay ESPN live/score data onto the openfootball fixture list.
// ESPN is fresher during and just after matches; openfootball catches up later.
export function mergeEspn(matches: WCMatch[], events: EspnEvent[]): WCMatch[] {
  if (events.length === 0) return matches;
  const byKey = new Map<string, EspnEvent>();
  for (const ev of events) {
    const names = ev.teams.map((t) => resolveTeamName(t.code, t.name));
    if (names.some((n) => n === null)) continue;
    byKey.set(pairKey(names[0]!, names[1]!, ev.utcDate), ev);
  }
  return matches.map((m) => {
    if (!m.kickoff) return m;
    const day = m.kickoff.toISOString().slice(0, 10);
    const ev = byKey.get(pairKey(m.team1, m.team2, day));
    if (!ev) return m;
    const scoreFor = (team: string): number | null => {
      const t = ev.teams.find(
        (x) => resolveTeamName(x.code, x.name) === team,
      );
      return t ? t.score : null;
    };
    if (ev.state === "in") {
      return {
        ...m,
        status: "live",
        score1: scoreFor(m.team1),
        score2: scoreFor(m.team2),
        clock: ev.clock || null,
      };
    }
    if (ev.state === "post" && m.status !== "finished") {
      return {
        ...m,
        status: "finished",
        score1: scoreFor(m.team1),
        score2: scoreFor(m.team2),
        clock: null,
      };
    }
    return m;
  });
}
