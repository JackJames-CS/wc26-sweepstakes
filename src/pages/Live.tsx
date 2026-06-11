import { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { useSquads } from "../hooks/useSquads";
import { TeamFlag } from "../components/TeamFlag";
import { ownerOf } from "../config/participants";
import { isToday, fmtTime, fmtDate } from "../lib/format";
import type { WCMatch, SquadPlayer } from "../types";

const POS_ORDER: Record<string, number> = { G: 0, D: 1, M: 2, F: 3 };
const POS_LABEL: Record<string, string> = { G: "Goalkeeper", D: "Defenders", M: "Midfielders", F: "Forwards" };

function fmtMin(minute: number, offset?: number) {
  return offset ? `${minute}+${offset}'` : `${minute}'`;
}

function MatchTab({
  match,
  active,
  onClick,
}: {
  match: WCMatch;
  active: boolean;
  onClick: () => void;
}) {
  const isLive = match.status === "live";
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? isLive
            ? "border-accent bg-accent/10 text-accent"
            : "border-ink bg-card"
          : "border-edge bg-card text-soft hover:border-ink/40 hover:text-ink"
      }`}
    >
      {isLive && <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />}
      <TeamFlag team={match.team1} size={18} />
      <span>{match.team1}</span>
      {match.status === "scheduled" ? (
        <span className="text-soft">{match.kickoff ? fmtTime(match.kickoff) : "TBC"}</span>
      ) : (
        <span className="tabular-nums">
          {match.score1 ?? 0}–{match.score2 ?? 0}
          {isLive && match.clock ? ` ${match.clock}` : ""}
          {match.status === "finished" ? " FT" : ""}
        </span>
      )}
      <span>v</span>
      <TeamFlag team={match.team2} size={18} />
      <span>{match.team2}</span>
    </button>
  );
}

function MatchHero({ match }: { match: WCMatch }) {
  const owner1 = ownerOf(match.team1);
  const owner2 = ownerOf(match.team2);
  const isLive = match.status === "live";

  return (
    <div
      className="overflow-hidden rounded-2xl text-white shadow-lg"
      style={{
        background: isLive
          ? "linear-gradient(120deg, #7f0000, #1a1a2e, #003366)"
          : "linear-gradient(120deg, #1a1a2e, #16213e, #41295a)",
        backgroundSize: "300% 300%",
        animation: "hero-sheen 12s ease-in-out infinite",
      }}
    >
      <div className="px-6 py-6 sm:py-8">
        {isLive && (
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-400" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
              Live {match.clock ?? ""}
            </span>
          </div>
        )}
        {match.status === "finished" && (
          <div className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-white/50">
            Full Time
          </div>
        )}
        {match.status === "scheduled" && (
          <div className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-white/50">
            {match.kickoff ? `${fmtDate(match.kickoff)} · ${fmtTime(match.kickoff)}` : "TBC"}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* Team 1 */}
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <TeamFlag team={match.team1} size={56} />
            <div className="text-base font-extrabold leading-tight sm:text-xl">{match.team1}</div>
            {owner1 && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{ backgroundColor: owner1.colour }}
              >
                {owner1.name}
              </span>
            )}
          </div>

          {/* Score */}
          <div className="shrink-0 text-center">
            {match.status === "scheduled" ? (
              <div className="text-2xl font-black text-white/40">vs</div>
            ) : (
              <div className="text-5xl font-black tabular-nums sm:text-6xl">
                {match.score1 ?? 0}&nbsp;–&nbsp;{match.score2 ?? 0}
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
            <TeamFlag team={match.team2} size={56} />
            <div className="text-base font-extrabold leading-tight sm:text-xl">{match.team2}</div>
            {owner2 && (
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{ backgroundColor: owner2.colour }}
              >
                {owner2.name}
              </span>
            )}
          </div>
        </div>

        {match.ground && (
          <div className="mt-4 text-center text-xs text-white/40">{match.ground}</div>
        )}
        <div className="mt-1 text-center text-xs text-white/30 uppercase tracking-widest">{match.stage}</div>
      </div>
    </div>
  );
}

function GoalTimeline({ match }: { match: WCMatch }) {
  const events = useMemo(() => {
    let s1 = 0, s2 = 0;
    return [
      ...match.goals1.map((g) => ({ ...g, side: 1 as const, team: match.team1 })),
      ...match.goals2.map((g) => ({ ...g, side: 2 as const, team: match.team2 })),
    ]
      .sort((a, b) => a.minute - b.minute || (a.offset ?? 0) - (b.offset ?? 0))
      .map((e) => {
        if (e.side === 1) s1++;
        else s2++;
        return { ...e, rs1: s1, rs2: s2 };
      });
  }, [match]);

  if (events.length === 0) {
    if (match.status === "scheduled") return null;
    return (
      <p className="text-center text-sm text-soft py-4">
        {match.status === "live" ? "Waiting for the first goal…" : "No goals scored."}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((e, i) => {
        const leftAligned = e.side === 1;
        const owner = ownerOf(e.team);
        return (
          <div
            key={i}
            className={`flex items-center gap-3 ${leftAligned ? "" : "flex-row-reverse"}`}
          >
            {/* Minute */}
            <span className="w-12 shrink-0 text-center text-xs font-bold text-soft tabular-nums">
              {fmtMin(e.minute, e.offset)}
            </span>

            {/* Event card */}
            <div
              className={`flex flex-1 items-center gap-2 rounded-lg border border-edge bg-card px-3 py-2 shadow-sm ${
                leftAligned ? "" : "flex-row-reverse text-right"
              }`}
              style={owner ? { borderColor: `${owner.colour}66` } : undefined}
            >
              <TeamFlag team={e.team} size={20} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {e.owngoal ? "⚽ Own goal" : "⚽"}{" "}
                  {e.name}
                  {e.penalty ? " (pen)" : ""}
                  {e.owngoal ? " (og)" : ""}
                </div>
                {owner && (
                  <div className="text-xs" style={{ color: owner.colour }}>
                    {owner.name}'s team
                  </div>
                )}
              </div>
              <span className="shrink-0 font-black tabular-nums text-sm">
                {e.rs1}–{e.rs2}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SquadPanel({
  team,
  squad,
  scorers,
}: {
  team: string;
  squad: SquadPlayer[];
  scorers: Set<string>;
}) {
  const owner = ownerOf(team);
  const grouped = useMemo(() => {
    const g: Record<string, SquadPlayer[]> = {};
    for (const p of squad) {
      (g[p.pos] ??= []).push(p);
    }
    return Object.entries(g).sort(([a], [b]) => (POS_ORDER[a] ?? 9) - (POS_ORDER[b] ?? 9));
  }, [squad]);

  return (
    <div className="rounded-xl border border-edge bg-card shadow-sm overflow-hidden">
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-edge"
        style={owner ? { borderBottomColor: `${owner.colour}66` } : undefined}
      >
        <TeamFlag team={team} size={22} />
        <span className="font-bold">{team}</span>
        {owner && (
          <span
            className="ml-auto rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: owner.colour }}
          >
            {owner.name}
          </span>
        )}
      </div>

      {squad.length === 0 ? (
        <p className="px-4 py-3 text-sm text-soft">Squad not available</p>
      ) : (
        <div>
          {grouped.map(([pos, players]) => (
            <div key={pos}>
              <div className="bg-cream px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-soft">
                {POS_LABEL[pos] ?? pos}
              </div>
              {players.map((p) => {
                const scored = scorers.has(p.name.toLowerCase());
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 border-b border-edge px-4 py-2 last:border-b-0 text-sm ${
                      scored ? "bg-amber-50" : ""
                    }`}
                  >
                    <span className="w-6 shrink-0 text-center text-xs font-bold text-soft tabular-nums">
                      {p.jersey ?? "—"}
                    </span>
                    <span className={`flex-1 font-medium ${scored ? "text-amber-700" : ""}`}>
                      {p.name}
                      {scored && " ⚽"}
                    </span>
                    {p.club && (
                      <span className="text-xs text-soft truncate max-w-[80px]">{p.club}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Live() {
  const { matches } = useData();
  const { selected } = useParticipant();
  const { squads } = useSquads();

  const todayMatches = useMemo(() => {
    let list = matches.filter((m) => isToday(m.kickoff));
    if (selected && selected.teams.length > 0) {
      // Put selected participant's matches first but still show all
    }
    const order = { live: 0, scheduled: 1, finished: 2 } as const;
    return list.sort(
      (a, b) =>
        order[a.status] - order[b.status] ||
        (a.kickoff?.getTime() ?? 0) - (b.kickoff?.getTime() ?? 0),
    );
  }, [matches, selected]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeMatch: WCMatch | undefined =
    (selectedId ? todayMatches.find((m) => m.id === selectedId) : undefined) ??
    todayMatches[0];

  const scorers1 = useMemo(
    () => new Set((activeMatch?.goals1 ?? []).map((g) => g.name.toLowerCase())),
    [activeMatch],
  );
  const scorers2 = useMemo(
    () => new Set((activeMatch?.goals2 ?? []).map((g) => g.name.toLowerCase())),
    [activeMatch],
  );

  const squad1 = squads?.[activeMatch?.team1 ?? ""] ?? [];
  const squad2 = squads?.[activeMatch?.team2 ?? ""] ?? [];

  if (todayMatches.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-soft">
        <span className="text-4xl">📅</span>
        <p className="text-sm font-medium">No matches today</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      {/* Match selector */}
      {todayMatches.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {todayMatches.map((m) => (
            <MatchTab
              key={m.id}
              match={m}
              active={activeMatch?.id === m.id}
              onClick={() => setSelectedId(m.id)}
            />
          ))}
        </div>
      )}

      {activeMatch && (
        <>
          <MatchHero match={activeMatch} />

          {/* Goal timeline */}
          {(activeMatch.status !== "scheduled" ||
            activeMatch.goals1.length + activeMatch.goals2.length > 0) && (
            <section>
              <h2 className="mb-3 text-lg font-bold">⚽ Goals</h2>
              <GoalTimeline match={activeMatch} />
            </section>
          )}

          {/* Squad sheets */}
          <section>
            <h2 className="mb-3 text-lg font-bold">📋 Squads</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <SquadPanel team={activeMatch.team1} squad={squad1} scorers={scorers1} />
              <SquadPanel team={activeMatch.team2} squad={squad2} scorers={scorers2} />
            </div>
          </section>
        </>
      )}
    </div>
  );
}
