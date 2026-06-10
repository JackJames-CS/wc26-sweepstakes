import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../context/DataContext";
import { ownerOf } from "../config/participants";
import { TeamFlag } from "./TeamFlag";
import type { WCMatch } from "../types";

// Full-screen takeover when a goal goes in on a live match.
// Detects score changes between ESPN polls; a score drop = VAR toast.

type FlashEvent = {
  key: string;
  kind: "goal" | "var";
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  scoringTeam: string;
  scorer?: string;
  minute?: string;
  penalty?: boolean;
  ownGoal?: boolean;
};

const GOAL_MS = 9000;
const VAR_MS = 6000;

const CONFETTI_COLOURS = [
  "#e63946",
  "#f4a261",
  "#3B82F6",
  "#10B981",
  "#FBBF24",
  "#ffffff",
];

function fmtMinute(minute: number, offset?: number): string {
  return offset ? `${minute}'+${offset}'` : `${minute}'`;
}

// Only trust the scorer detail once ESPN's goal list has caught up
// with the new score — details can lag the score by a poll.
function scorerFor(m: WCMatch, side: 1 | 2, newScore: number) {
  const list = side === 1 ? m.goals1 : m.goals2;
  return list.length === newScore ? list[list.length - 1] : undefined;
}

export function GoalFlash() {
  const { matches } = useData();
  const prev = useRef<Map<
    string,
    { s1: number | null; s2: number | null }
  > | null>(null);
  const [queue, setQueue] = useState<FlashEvent[]>([]);

  useEffect(() => {
    if (matches.length === 0) return;
    const cur = new Map(
      matches.map((m) => [m.id, { s1: m.score1, s2: m.score2 }]),
    );
    // First load is the baseline — never celebrate goals scored before
    // the page was opened.
    if (prev.current === null) {
      prev.current = cur;
      return;
    }
    const events: FlashEvent[] = [];
    for (const m of matches) {
      if (m.status === "scheduled") continue;
      const before = prev.current.get(m.id);
      if (!before) continue;
      for (const side of [1, 2] as const) {
        const was = side === 1 ? before.s1 : before.s2;
        const now = side === 1 ? m.score1 : m.score2;
        if (was === null || now === null || was === now) continue;
        const scoringTeam = side === 1 ? m.team1 : m.team2;
        if (now > was) {
          const g = scorerFor(m, side, now);
          events.push({
            key: `${m.id}|${side}|${now}|goal`,
            kind: "goal",
            team1: m.team1,
            team2: m.team2,
            score1: m.score1 ?? 0,
            score2: m.score2 ?? 0,
            scoringTeam,
            scorer: g?.name || undefined,
            minute: g ? fmtMinute(g.minute, g.offset) : undefined,
            penalty: g?.penalty,
            ownGoal: g?.owngoal,
          });
        } else {
          events.push({
            key: `${m.id}|${side}|${now}|var`,
            kind: "var",
            team1: m.team1,
            team2: m.team2,
            score1: m.score1 ?? 0,
            score2: m.score2 ?? 0,
            scoringTeam,
          });
        }
      }
    }
    prev.current = cur;
    if (events.length > 0) setQueue((q) => [...q, ...events]);
  }, [matches]);

  // Preview mode: open the site with ?goaltest before the # to see the overlay.
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("goaltest")) return;
    setQueue((q) => [
      ...q,
      {
        key: "goaltest",
        kind: "goal",
        team1: "Mexico",
        team2: "South Africa",
        score1: 1,
        score2: 0,
        scoringTeam: "Mexico",
        scorer: "Raúl Jiménez",
        minute: "23'",
      },
    ]);
  }, []);

  const current: FlashEvent | undefined = queue[0];

  useEffect(() => {
    if (!current) return;
    const id = window.setTimeout(
      () => setQueue((q) => q.slice(1)),
      current.kind === "goal" ? GOAL_MS : VAR_MS,
    );
    return () => clearTimeout(id);
  }, [current]);

  const owner =
    current && current.kind === "goal"
      ? ownerOf(current.scoringTeam)
      : undefined;

  const pieces = useMemo(() => {
    if (!current || current.kind !== "goal") return [];
    const colours = owner
      ? [owner.colour, "#ffffff", "#f4a261"]
      : CONFETTI_COLOURS;
    return Array.from({ length: 80 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      dur: 2.8 + Math.random() * 2.4,
      size: 6 + Math.random() * 8,
      colour: colours[i % colours.length],
      round: Math.random() < 0.4,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.key]);

  if (!current) return null;
  const dismiss = () => setQueue((q) => q.slice(1));

  if (current.kind === "var") {
    return (
      <div
        className="fixed inset-x-0 top-4 z-[100] flex cursor-pointer justify-center px-4"
        style={{ animation: "rise-in 0.4s ease-out both" }}
        onClick={dismiss}
      >
        <div className="flex items-center gap-3 rounded-xl border-2 border-tangerine bg-navy px-5 py-3 text-white shadow-2xl">
          <span className="text-2xl">📺</span>
          <div>
            <div className="font-extrabold">VAR — goal disallowed</div>
            <div className="text-sm text-white/80">
              {current.team1} {current.score1}–{current.score2} {current.team2}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden"
      onClick={dismiss}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(26,26,46,0.92), rgba(10,10,20,0.97))",
        animation: "flash-fade-in 0.3s ease-out both",
      }}
    >
      <div className="motion-reduce:hidden" aria-hidden>
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-0"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              backgroundColor: p.colour,
              borderRadius: p.round ? "50%" : "2px",
              animation: `confetti-fall ${p.dur}s linear ${p.delay}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="relative flex h-full flex-col items-center justify-center gap-5 px-6 text-center text-white">
        <div
          className="text-6xl font-black tracking-tight sm:text-8xl"
          style={{
            animation: "goal-zoom 0.6s cubic-bezier(0.2, 1.4, 0.4, 1) both",
          }}
        >
          {current.ownGoal ? "OWN GOAL!" : "GOOOAL!"}
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-2xl font-extrabold sm:text-4xl"
          style={{ animation: "rise-in 0.5s ease-out 0.25s both" }}
        >
          <TeamFlag team={current.team1} size={40} />
          <span>{current.team1}</span>
          <span className="tabular-nums text-tangerine">
            {current.score1} – {current.score2}
          </span>
          <span>{current.team2}</span>
          <TeamFlag team={current.team2} size={40} />
        </div>
        {current.scorer && (
          <div
            className="text-lg font-semibold text-white/90 sm:text-2xl"
            style={{ animation: "rise-in 0.5s ease-out 0.45s both" }}
          >
            ⚽ {current.scorer} {current.minute}
            {current.penalty ? " (pen)" : ""}
            {current.ownGoal ? " (og)" : ""}
          </div>
        )}
        {owner && (
          <div
            className="rounded-full px-5 py-2 text-lg font-bold shadow-lg"
            style={{
              backgroundColor: owner.colour,
              animation: "rise-in 0.5s ease-out 0.65s both",
            }}
          >
            🎉 That's {owner.name}'s team!
          </div>
        )}
        <div className="absolute bottom-6 text-xs text-white/40">
          tap anywhere to dismiss
        </div>
      </div>
    </div>
  );
}
