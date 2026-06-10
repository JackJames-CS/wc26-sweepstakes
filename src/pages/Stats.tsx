import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { computeStats } from "../lib/stats";
import { computeGoldenBoot } from "../lib/goldenboot";
import { participants, drawDone } from "../config/participants";
import { isAlive } from "../lib/status";
import { TeamFlag } from "../components/TeamFlag";
import type { WCMatch } from "../types";

function Tile({
  emoji,
  value,
  label,
  sub,
}: {
  emoji: string;
  value: ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-edge bg-card p-4 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="mt-1 text-2xl font-extrabold tabular-nums">{value}</div>
      <div className="text-xs font-semibold text-soft">{label}</div>
      {sub && <div className="mt-0.5 text-[11px] text-soft">{sub}</div>}
    </div>
  );
}

function RecordRow({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-edge px-4 py-3 text-sm last:border-b-0">
      <span className="text-xl">{emoji}</span>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-soft">
          {title}
        </div>
        <div className="font-semibold">{children}</div>
      </div>
    </div>
  );
}

function matchLine(m: WCMatch): string {
  return `${m.team1} ${m.score1}–${m.score2} ${m.team2}`;
}

export function Stats() {
  const { matches, statuses } = useData();
  const stats = useMemo(() => computeStats(matches), [matches]);
  const boot = useMemo(() => computeGoldenBoot(matches, 20), [matches]);

  // Pre-tournament: nothing to count yet — show the shape of what's coming.
  if (stats.played === 0) {
    const venues = new Set(matches.map((m) => m.ground).filter(Boolean)).size;
    const kicks = matches
      .filter((m) => m.kickoff)
      .map((m) => m.kickoff!.getTime());
    const days =
      kicks.length > 0
        ? Math.round((Math.max(...kicks) - Math.min(...kicks)) / 86400000) + 1
        : 0;
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-lg font-bold">📊 Tournament stats</h2>
        <div className="rounded-xl border border-edge bg-card p-6 text-center shadow-sm">
          <div className="text-3xl">🤫</div>
          <p className="mt-2 font-bold">Nothing to count yet</p>
          <p className="text-sm text-soft">
            Goals, records and bragging rights appear here after the first
            whistle.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile emoji="🌍" value={48} label="teams" />
          <Tile emoji="⚽" value={matches.length} label="matches" />
          <Tile emoji="🏟️" value={venues} label="venues" />
          <Tile emoji="📅" value={days} label="days of football" />
        </div>
      </div>
    );
  }

  const poolRows = drawDone
    ? participants
        .map((p) => ({
          p,
          alive: p.teams.filter((t) => isAlive(statuses.get(t) ?? "group"))
            .length,
          goals: p.teams.reduce(
            (s, t) => s + (stats.teamGoals.get(t) ?? 0),
            0,
          ),
        }))
        .sort((a, b) => b.goals - a.goals || b.alive - a.alive)
    : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-lg font-bold">📊 Tournament stats</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Tile
          emoji="⚽"
          value={stats.totalGoals}
          label="goals"
          sub={`${stats.avgGoals.toFixed(1)} per match`}
        />
        <Tile
          emoji="🏟️"
          value={`${stats.played}/${matches.length}`}
          label="matches played"
        />
        <Tile emoji="⏰" value={stats.lateGoals} label="goals in the 90'+" />
        <Tile emoji="🎯" value={stats.penalties} label="penalties scored" />
        <Tile emoji="😱" value={stats.ownGoals} label="own goals" />
        <Tile emoji="⚡" value={stats.hatTricks.length} label="hat-tricks" />
      </div>

      <section className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
        {stats.fastestGoal && (
          <RecordRow emoji="⏱️" title="Fastest goal">
            {stats.fastestGoal.goal.name} {stats.fastestGoal.goal.minute}'
            {stats.fastestGoal.goal.owngoal ? " (og)" : ""} —{" "}
            {matchLine(stats.fastestGoal.match)}
          </RecordRow>
        )}
        {stats.biggestWin && (
          <RecordRow emoji="🔨" title="Biggest win">
            {matchLine(stats.biggestWin)}
          </RecordRow>
        )}
        {stats.goalFest && (
          <RecordRow emoji="🍿" title="Highest-scoring match">
            {matchLine(stats.goalFest)}
          </RecordRow>
        )}
        {stats.hatTricks.map((h) => (
          <RecordRow key={`${h.name}-${h.match.id}`} emoji="⚡" title="Hat-trick">
            {h.name} ({h.team}) — {h.goals} goals v{" "}
            {h.match.team1 === h.team ? h.match.team2 : h.match.team1}
          </RecordRow>
        ))}
      </section>

      {drawDone && poolRows.length > 0 && (
        <section>
          <h3 className="mb-2 font-bold">🏅 Pool bragging rights</h3>
          <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
            {poolRows.map(({ p, alive, goals }, i) => (
              <div
                key={p.id}
                className="flex items-center gap-2 border-b border-edge px-4 py-2 text-sm last:border-b-0"
              >
                <span className="w-5 text-center font-bold text-soft">
                  {i + 1}
                </span>
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: p.colour }}
                />
                <span className="font-semibold">{p.name}</span>
                <span className="ml-auto text-xs text-soft">
                  {alive}/{p.teams.length} alive
                </span>
                <span className="w-16 text-right font-bold tabular-nums">
                  {goals} ⚽
                </span>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-soft">
            Goals scored by each player's teams. Not a points system — just
            ammunition.
          </p>
        </section>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {stats.topAttack.length > 0 && (
          <section>
            <h3 className="mb-2 font-bold">🔥 Top attack</h3>
            <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
              {stats.topAttack.map((t) => (
                <Link
                  key={t.team}
                  to={`/teams/${encodeURIComponent(t.team)}`}
                  className="flex items-center gap-2 border-b border-edge px-4 py-2 text-sm last:border-b-0 hover:bg-cream"
                >
                  <TeamFlag team={t.team} size={18} />
                  <span className="font-medium">{t.team}</span>
                  <span className="ml-auto font-bold tabular-nums">
                    {t.goals} ⚽
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
        {stats.cleanSheets.length > 0 && (
          <section>
            <h3 className="mb-2 font-bold">🧤 Clean sheets</h3>
            <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
              {stats.cleanSheets.map((t) => (
                <Link
                  key={t.team}
                  to={`/teams/${encodeURIComponent(t.team)}`}
                  className="flex items-center gap-2 border-b border-edge px-4 py-2 text-sm last:border-b-0 hover:bg-cream"
                >
                  <TeamFlag team={t.team} size={18} />
                  <span className="font-medium">{t.team}</span>
                  <span className="ml-auto font-bold tabular-nums">
                    {t.count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {boot.length > 0 && (
        <section>
          <h3 className="mb-2 font-bold">🥇 Golden Boot — top 20</h3>
          <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
            {boot.map((s, i) => (
              <div
                key={`${s.name}-${s.team}`}
                className="flex items-center gap-2 border-b border-edge px-4 py-2 text-sm last:border-b-0"
              >
                <span className="w-5 text-center font-bold text-soft">
                  {i + 1}
                </span>
                <TeamFlag team={s.team} size={18} />
                <span className="font-medium">{s.name}</span>
                <span className="ml-auto font-bold tabular-nums">
                  {s.goals} ⚽
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
