import type { TeamStatus, WCMatch } from "../types";
import { TEAM_BY_NAME } from "../data/teams";
import { TEAM_HISTORY } from "../data/teamHistory";
import { participants, drawDone, ownerOf } from "../config/participants";
import { isAlive } from "./status";
import { computeStats } from "./stats";
import { dayKey } from "./format";

// "The Daily Sweep" — sports commentary for the sweepstake itself.
// Everything is computed from match data; the same bulletin is shown to
// everyone on a given day (seeded by the date), the ↻ button reshuffles.

export type Story = {
  emoji: string;
  text: string;
  weight: number; // higher = more headline-worthy
  to?: string;
};

export type Bulletin = { headline: Story; lines: Story[] };

// ── crude pre-tournament pedigree, for "lowest-ranked still alive" fun ──

function finishScore(bestFinish: string): number {
  const f = bestFinish.toLowerCase();
  if (f.includes("champion")) return 100;
  if (f.includes("runners-up")) return 80;
  if (f.includes("third") || f.includes("fourth") || f.includes("semi"))
    return 65;
  if (f.includes("quarter")) return 50;
  if (f.includes("round of 16") || f.includes("second round")) return 35;
  return 10;
}

export function strengthOf(team: string): number {
  const code = TEAM_BY_NAME.get(team)?.fifaCode;
  const h = code ? TEAM_HISTORY[code] : undefined;
  if (!h) return 0;
  return h.titles.length * 40 + finishScore(h.bestFinish) + h.appearances * 2;
}

// ── goal-timeline reconstruction (null when goal data is incomplete) ──

function timeline(m: WCMatch): { min: number; side: 1 | 2 }[] | null {
  const total = (m.score1 ?? 0) + (m.score2 ?? 0);
  const list = [
    ...m.goals1.map((g) => ({
      min: g.minute + (g.offset ?? 0) / 10,
      side: 1 as const,
    })),
    ...m.goals2.map((g) => ({
      min: g.minute + (g.offset ?? 0) / 10,
      side: 2 as const,
    })),
  ];
  if (list.length !== total) return null;
  return list.sort((a, b) => a.min - b.min);
}

// Minutes of this match the team spent NOT losing; null if unknown.
function minutesNotTrailing(m: WCMatch, team: string): number | null {
  const tl = timeline(m);
  if (tl === null) return null;
  const mine = m.team1 === team ? 1 : 2;
  let s1 = 0;
  let s2 = 0;
  let last = 0;
  let acc = 0;
  const trailing = () => (mine === 1 ? s1 < s2 : s2 < s1);
  for (const g of tl) {
    const at = Math.min(g.min, 90);
    if (!trailing()) acc += at - last;
    last = at;
    if (g.side === 1) s1++;
    else s2++;
  }
  if (!trailing()) acc += 90 - last;
  return Math.round(acc);
}

function wasEverTrailing(m: WCMatch, team: string): boolean | null {
  const mins = minutesNotTrailing(m, team);
  return mins === null ? null : mins < 90;
}

function teamLink(team: string): string {
  return `/teams/${encodeURIComponent(team)}`;
}

function ownerTag(team: string, prefix = " — "): string {
  const o = ownerOf(team);
  return o ? `${prefix}that's ${o.name}'s.` : "";
}

// ── story generators ──

function buildStories(
  matches: WCMatch[],
  statuses: Map<string, TeamStatus>,
): Story[] {
  const stories: Story[] = [];
  const finished = matches.filter(
    (m) => m.status === "finished" && m.score1 !== null && m.score2 !== null,
  );
  const stats = computeStats(matches);
  const playedTeams = new Set(finished.flatMap((m) => [m.team1, m.team2]));

  const winnerOf = (m: WCMatch) =>
    m.score1! > m.score2! ? m.team1 : m.score2! > m.score1! ? m.team2 : null;
  const loserOf = (m: WCMatch) =>
    m.score1! > m.score2! ? m.team2 : m.score2! > m.score1! ? m.team1 : null;

  // Fastest goal so far
  if (stats.fastestGoal) {
    const r = stats.fastestGoal;
    stories.push({
      emoji: "⏱️",
      text: `Fastest goal of the tournament so far: ${r.goal.name} after ${r.goal.minute} minutes for ${r.team} against ${r.opponent}.${ownerTag(r.team)}`,
      weight: 25,
      to: teamLink(r.team),
    });
  }

  // Never trailed / iron-wall minutes
  let bestNoTrail: { team: string; mins: number } | null = null;
  for (const team of playedTeams) {
    const theirs = finished.filter(
      (m) => m.team1 === team || m.team2 === team,
    );
    let mins = 0;
    let known = true;
    let everTrailed = false;
    for (const m of theirs) {
      const v = minutesNotTrailing(m, team);
      if (v === null) {
        known = false;
        break;
      }
      mins += v;
      if (v < 90) everTrailed = true;
    }
    if (!known || everTrailed || theirs.length === 0) continue;
    if (!bestNoTrail || mins > bestNoTrail.mins)
      bestNoTrail = { team, mins };
  }
  if (bestNoTrail && bestNoTrail.mins >= 180) {
    stories.push({
      emoji: "🛡️",
      text: `${bestNoTrail.team} have now played ${bestNoTrail.mins} minutes without trailing for a single second.${ownerTag(bestNoTrail.team)}`,
      weight: 40,
      to: teamLink(bestNoTrail.team),
    });
  }

  // Toughest average opposition (min 2 games)
  let toughest: { team: string; avg: number } | null = null;
  for (const team of playedTeams) {
    const opps = finished
      .filter((m) => m.team1 === team || m.team2 === team)
      .map((m) => (m.team1 === team ? m.team2 : m.team1));
    if (opps.length < 2) continue;
    const avg = opps.reduce((s, o) => s + strengthOf(o), 0) / opps.length;
    if (!toughest || avg > toughest.avg) toughest = { team, avg };
  }
  if (toughest) {
    stories.push({
      emoji: "🥊",
      text: `Nobody has had it harder: ${toughest.team} have faced the toughest average opposition in the tournament.${ownerTag(toughest.team)}`,
      weight: 20,
      to: teamLink(toughest.team),
    });
  }

  // Shocks, comebacks, late winners — most recent first carries more weight
  const byKickoff = [...finished].sort(
    (a, b) => (b.kickoff?.getTime() ?? 0) - (a.kickoff?.getTime() ?? 0),
  );
  for (const [i, m] of byKickoff.entries()) {
    const recency = Math.max(0, 15 - i * 3); // fades over the last few games
    const w = winnerOf(m);
    const l = loserOf(m);
    if (!w || !l) continue;
    if (strengthOf(l) - strengthOf(w) >= 60) {
      stories.push({
        emoji: "😲",
        text: `Shock of the tournament? ${w} beat ${l} ${m.score1}–${m.score2}.${ownerTag(w, " Cash in, ")}`,
        weight: 55 + recency,
        to: teamLink(w),
      });
    }
    if (wasEverTrailing(m, w) === true) {
      stories.push({
        emoji: "↩️",
        text: `${w} came from behind to beat ${l} ${m.score1}–${m.score2}.${ownerTag(w)}`,
        weight: 40 + recency,
        to: teamLink(w),
      });
    }
    const tl = timeline(m);
    if (tl && Math.abs(m.score1! - m.score2!) === 1) {
      const lastGoal = tl[tl.length - 1];
      const winnerSide = m.team1 === w ? 1 : 2;
      if (lastGoal && lastGoal.side === winnerSide && lastGoal.min >= 85) {
        stories.push({
          emoji: "⏰",
          text: `${w} snatched it at the death against ${l} — the winner came in the ${Math.floor(lastGoal.min)}th minute.${ownerTag(w)}`,
          weight: 45 + recency,
          to: teamLink(w),
        });
      }
    }
  }

  // Current win streaks
  for (const team of playedTeams) {
    const theirs = finished
      .filter((m) => m.team1 === team || m.team2 === team)
      .sort((a, b) => (a.kickoff?.getTime() ?? 0) - (b.kickoff?.getTime() ?? 0));
    let streak = 0;
    for (let i = theirs.length - 1; i >= 0; i--) {
      if (winnerOf(theirs[i]) === team) streak++;
      else break;
    }
    if (streak >= 3) {
      stories.push({
        emoji: "🔥",
        text: `${team} have won ${streak} on the bounce.${ownerTag(team)}`,
        weight: 30 + streak * 5,
        to: teamLink(team),
      });
    }
  }

  // Latest completed matchday goal count
  const lastDay = byKickoff[0]?.kickoff ? dayKey(byKickoff[0].kickoff!) : null;
  if (lastDay) {
    const dayMatches = finished.filter(
      (m) => m.kickoff && dayKey(m.kickoff) === lastDay,
    );
    const g = dayMatches.reduce(
      (s, m) => s + (m.score1 ?? 0) + (m.score2 ?? 0),
      0,
    );
    if (dayMatches.length >= 2) {
      stories.push({
        emoji: "⚽",
        text: `${g} goal${g === 1 ? "" : "s"} across ${dayMatches.length} games on the latest matchday.`,
        weight: 12,
        to: "/history",
      });
    }
  }

  // Eliminations
  const dead = [...statuses.entries()].filter(
    ([, s]) => s === "eliminated",
  );
  if (dead.length > 0) {
    stories.push({
      emoji: "⚰️",
      text: `${dead.length} of 48 teams are already on the plane home.`,
      weight: 10,
      to: "/teams",
    });
  }

  // ── owner stories (after the draw) ──
  if (drawDone) {
    const aliveTeams = [...statuses.entries()]
      .filter(([t, s]) => isAlive(s) && TEAM_BY_NAME.has(t))
      .map(([t]) => t);

    // Lowest-ranked team still alive
    if (aliveTeams.length > 0 && dead.length > 0) {
      const lowest = [...aliveTeams].sort(
        (a, b) => strengthOf(a) - strengthOf(b),
      )[0];
      const o = ownerOf(lowest);
      if (o) {
        stories.push({
          emoji: "🐢",
          text: `${o.name}'s ${lowest} are now the lowest-ranked team still alive.`,
          weight: 40,
          to: teamLink(lowest),
        });
      }
    }

    // Strongest remaining pair
    const byStrength = [...aliveTeams].sort(
      (a, b) => strengthOf(b) - strengthOf(a),
    );
    if (byStrength.length >= 2) {
      const [o1, o2] = [ownerOf(byStrength[0]), ownerOf(byStrength[1])];
      if (o1 && o1 === o2) {
        stories.push({
          emoji: "👑",
          text: `${o1.name} owns the two strongest teams left standing — ${byStrength[0]} and ${byStrength[1]}.`,
          weight: 60,
        });
      }
    }

    for (const p of participants) {
      if (p.teams.length === 0) continue;
      const alive = p.teams.filter((t) => isAlive(statuses.get(t) ?? "group"));
      if (alive.length === 0) {
        stories.push({
          emoji: "💀",
          text: `${p.name} has lost all ${p.teams.length} teams. Thoughts and prayers.`,
          weight: 55,
        });
      }
      // Stoppage-time fortune
      let lateGoals = 0;
      for (const m of finished) {
        for (const [goals, team] of [
          [m.goals1, m.team1],
          [m.goals2, m.team2],
        ] as const) {
          if (!p.teams.includes(team)) continue;
          lateGoals += goals.filter((g) => g.minute >= 90).length;
        }
      }
      if (lateGoals >= 2) {
        stories.push({
          emoji: "🍀",
          text: `${p.name} has now benefited from ${lateGoals} stoppage-time goals. Living right.`,
          weight: 35,
        });
      }
    }

    // Pool goal leader
    const goalRows = participants
      .filter((p) => p.teams.length > 0)
      .map((p) => ({
        p,
        goals: p.teams.reduce((s, t) => s + (stats.teamGoals.get(t) ?? 0), 0),
      }))
      .sort((a, b) => b.goals - a.goals);
    if (goalRows.length > 1 && goalRows[0].goals > goalRows[1].goals) {
      stories.push({
        emoji: "📈",
        text: `${goalRows[0].p.name}'s teams have scored ${goalRows[0].goals} goals — more than anyone else in the pool.`,
        weight: 25,
        to: "/stats",
      });
    }

    // Still dreaming
    const inHunt = participants.filter(
      (p) =>
        p.teams.length > 0 &&
        p.teams.some((t) => isAlive(statuses.get(t) ?? "group")),
    ).length;
    const playing = participants.filter((p) => p.teams.length > 0).length;
    if (dead.length > 0 && inHunt < playing) {
      stories.push({
        emoji: "🏆",
        text: `${inHunt} of ${playing} are still dreaming of the pot.`,
        weight: 18,
      });
    }
  }

  return stories;
}

// ── pre-tournament teaser ──

function preTournamentBulletin(matches: WCMatch[]): Bulletin | null {
  const opener = matches
    .filter((m) => m.kickoff)
    .sort((a, b) => a.kickoff!.getTime() - b.kickoff!.getTime())[0];
  if (!opener?.kickoff) return null;
  const today = dayKey(new Date()) === dayKey(opener.kickoff);
  const pot = participants.length * 10;
  const lines: Story[] = [];
  for (const t of [opener.team1, opener.team2]) {
    const code = TEAM_BY_NAME.get(t)?.fifaCode;
    const h = code ? TEAM_HISTORY[code] : undefined;
    if (h) lines.push({ emoji: "🎙️", text: `${t}: ${h.flavour}`, weight: 1, to: teamLink(t) });
  }
  lines.push({
    emoji: "💰",
    text: `${matches.length} matches. 39 days. €${pot} in the pot. One winner.`,
    weight: 1,
  });
  return {
    headline: {
      emoji: "🚨",
      text: today ? "It all kicks off today" : "It all kicks off tomorrow",
      weight: 100,
    },
    lines,
  };
}

// ── deterministic daily pick ──

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(pool: Story[], rng: () => number): Story {
  const total = pool.reduce((s, x) => s + x.weight, 0);
  let r = rng() * total;
  for (const s of pool) {
    r -= s.weight;
    if (r <= 0) return s;
  }
  return pool[pool.length - 1];
}

export function buildBulletin(
  matches: WCMatch[],
  statuses: Map<string, TeamStatus>,
  shuffle = 0,
): Bulletin | null {
  if (matches.length === 0) return null;
  const anyPlayed = matches.some((m) => m.status === "finished");
  if (!anyPlayed) return preTournamentBulletin(matches);

  const stories = buildStories(matches, statuses);
  if (stories.length === 0) return null;

  const rng = mulberry32(hash(dayKey(new Date())) + shuffle * 7919);
  // Headline from the most newsworthy tier; remaining lines sampled by weight.
  const maxW = Math.max(...stories.map((s) => s.weight));
  const headlinePool = stories.filter((s) => s.weight >= 0.7 * maxW);
  const headline = pickWeighted(headlinePool, rng);
  const rest = stories.filter((s) => s !== headline);
  // One story per subject where possible — a dramatic match shouldn't
  // fill the whole bulletin.
  const used = new Set<string>(headline.to ? [headline.to] : []);
  const lines: Story[] = [];
  while (lines.length < 3 && rest.length > 0) {
    const fresh = rest.filter((s) => !s.to || !used.has(s.to));
    const pick = pickWeighted(fresh.length > 0 ? fresh : rest, rng);
    lines.push(pick);
    if (pick.to) used.add(pick.to);
    rest.splice(rest.indexOf(pick), 1);
  }
  return { headline, lines };
}
