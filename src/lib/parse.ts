import type { OFMatch, WCMatch, MatchStatus } from "../types";
import { TEAM_BY_NAME } from "../data/teams";

const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function fetchOpenfootball(): Promise<OFMatch[]> {
  const res = await fetch(OPENFOOTBALL_URL);
  if (!res.ok) throw new Error(`openfootball fetch failed: ${res.status}`);
  const data = await res.json();
  return data.matches as OFMatch[];
}

// openfootball times look like "13:00 UTC-6" (venue-local time with offset)
export function parseKickoff(date: string, time?: string): Date | null {
  if (!time) return new Date(`${date}T12:00:00Z`);
  const m = time.match(/^(\d{1,2}):(\d{2})\s*UTC([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return new Date(`${date}T12:00:00Z`);
  const [, hh, mm, sign, offH, offM] = m;
  const iso = `${date}T${hh.padStart(2, "0")}:${mm}:00${sign}${offH.padStart(2, "0")}:${offM ?? "00"}`;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

export function isRealTeam(name: string): boolean {
  return TEAM_BY_NAME.has(name);
}

// "1A" → "1st Group A", "W73" → "Winner M73", "3A/B/C/D/F" → "3rd of A/B/C/D/F"
export function placeholderLabel(name: string): string {
  let m = name.match(/^([123])([A-L])$/);
  if (m) {
    const ord = { "1": "1st", "2": "2nd", "3": "3rd" }[m[1]];
    return `${ord} Group ${m[2]}`;
  }
  m = name.match(/^W(\d+)$/);
  if (m) return `Winner M${m[1]}`;
  m = name.match(/^L(\d+)$/);
  if (m) return `Loser M${m[1]}`;
  m = name.match(/^3([A-L](?:\/[A-L])+)$/);
  if (m) return `3rd of ${m[1]}`;
  return name;
}

const LIVE_WINDOW_MS = 105 * 60 * 1000; // 90 min + buffer

export function toWCMatches(raw: OFMatch[], now = new Date()): WCMatch[] {
  return raw.map((m) => {
    const kickoff = parseKickoff(m.date, m.time);
    const finished = m.score !== undefined;
    let status: MatchStatus = "scheduled";
    if (finished) status = "finished";
    else if (
      kickoff &&
      now.getTime() >= kickoff.getTime() &&
      now.getTime() <= kickoff.getTime() + LIVE_WINDOW_MS
    )
      status = "live";
    return {
      id: `${m.date}-${m.team1}-${m.team2}`,
      num: m.num,
      stage: m.group ?? m.round,
      group: m.group?.replace("Group ", ""),
      knockout: m.group === undefined,
      kickoff,
      team1: m.team1,
      team2: m.team2,
      score1: m.score ? m.score.ft[0] : null,
      score2: m.score ? m.score.ft[1] : null,
      status,
      clock: null,
      goals1: m.goals1 ?? [],
      goals2: m.goals2 ?? [],
      ground: m.ground,
    };
  });
}
