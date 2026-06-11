import type { EspnEvent, EspnGoal, EspnLineup, EspnLineupPlayer, Goal, WCMatch } from "../types";
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
  "bosnia-herzegovina": "Bosnia & Herzegovina",
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

// ESPN clock strings look like "45'" or "45'+2'"
function parseClock(display: string): { minute: number; offset?: number } {
  const m = display.match(/^(\d+)'(?:\s*\+\s*(\d+)')?/);
  if (!m) return { minute: 0 };
  return { minute: Number(m[1]), offset: m[2] ? Number(m[2]) : undefined };
}

type EspnCompetitor = {
  team: { id?: string; abbreviation?: string; displayName?: string };
  score?: string;
};

type EspnDetail = {
  type?: { text?: string };
  clock?: { displayValue?: string };
  team?: { id?: string };
  scoringPlay?: boolean;
  penaltyKick?: boolean;
  ownGoal?: boolean;
  athletesInvolved?: { displayName?: string }[];
};

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
    const competitors: EspnCompetitor[] = comp.competitors ?? [];
    const teams = competitors.map((c) => ({
      code: c.team?.abbreviation ?? "",
      name: c.team?.displayName ?? "",
      score: Number(c.score ?? 0),
    }));
    if (teams.length !== 2) continue;
    // detail.team.id is the SCORER's team — map it back to code/name
    const byId = new Map(
      competitors.map((c) => [
        c.team?.id ?? "",
        { code: c.team?.abbreviation ?? "", name: c.team?.displayName ?? "" },
      ]),
    );
    const goals: EspnGoal[] = [];
    for (const d of (comp.details ?? []) as EspnDetail[]) {
      if (!d.scoringPlay) continue;
      const t = byId.get(d.team?.id ?? "");
      if (!t) continue;
      const { minute, offset } = parseClock(d.clock?.displayValue ?? "");
      goals.push({
        teamCode: t.code,
        teamName: t.name,
        scorer: d.athletesInvolved?.[0]?.displayName ?? "",
        minute,
        offset,
        penalty: d.penaltyKick === true,
        ownGoal: d.ownGoal === true,
      });
    }
    events.push({
      id: e.id ?? "",
      utcDate: (e.date ?? "").slice(0, 10),
      state,
      clock: comp.status?.displayClock ?? "",
      teams,
      goals,
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
    // ESPN scoring plays → openfootball goal lists (own goals count for
    // the opposition, listed under the side they scored FOR, like openfootball).
    const goalsFor = (team: string, other: string): Goal[] =>
      ev.goals
        .filter((g) => {
          const scorerTeam = resolveTeamName(g.teamCode, g.teamName);
          if (!scorerTeam) return false;
          const benefits = g.ownGoal
            ? scorerTeam === team
              ? other
              : team
            : scorerTeam;
          return benefits === team;
        })
        .map((g) => ({
          name: g.scorer,
          minute: g.minute,
          offset: g.offset,
          penalty: g.penalty || undefined,
          owngoal: g.ownGoal || undefined,
        }));
    if (ev.state === "in") {
      return {
        ...m,
        espnId: ev.id || m.espnId,
        status: "live",
        score1: scoreFor(m.team1),
        score2: scoreFor(m.team2),
        clock: ev.clock || null,
        goals1: goalsFor(m.team1, m.team2),
        goals2: goalsFor(m.team2, m.team1),
      };
    }
    if (ev.state === "post" && m.status !== "finished") {
      return {
        ...m,
        espnId: ev.id || m.espnId,
        status: "finished",
        score1: scoreFor(m.team1),
        score2: scoreFor(m.team2),
        clock: null,
        goals1: goalsFor(m.team1, m.team2),
        goals2: goalsFor(m.team2, m.team1),
      };
    }
    if (ev.id) {
      return { ...m, espnId: ev.id };
    }
    return m;
  });
}

const ESPN_SUMMARY = (id: string) =>
  `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${id}`;

export async function fetchEspnLineup(eventId: string): Promise<EspnLineup> {
  const res = await fetch(ESPN_SUMMARY(eventId));
  if (!res.ok) return null;
  const data = await res.json();
  const rosters: unknown[] = data.rosters ?? [];
  if (rosters.length < 2) return null;

  const parseRoster = (roster: unknown): EspnLineupPlayer[] => {
    const entries: unknown[] = (roster as { entries?: unknown[] }).entries ?? [];
    return entries.map((e) => {
      const entry = e as {
        starter?: boolean;
        subbedIn?: boolean;
        subbedOut?: boolean;
        athlete?: { displayName?: string; jersey?: string };
        position?: { abbreviation?: string };
      };
      return {
        name: entry.athlete?.displayName ?? "",
        jersey: entry.athlete?.jersey ?? null,
        starter: entry.starter ?? false,
        subbedIn: entry.subbedIn ?? false,
        subbedOut: entry.subbedOut ?? false,
        posAbbr: entry.position?.abbreviation ?? "",
      };
    });
  };

  return {
    team1: parseRoster(rosters[0]),
    team2: parseRoster(rosters[1]),
  };
}
