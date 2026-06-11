import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { isToday, fmtTime } from "../lib/format";
import { TEAM_BY_NAME } from "../data/teams";
import { isRealTeam } from "../lib/parse";
import { ownerOf } from "../config/participants";

export function LiveBanner() {
  const { matches } = useData();
  const { selected } = useParticipant();

  const today = matches.filter((m) => isToday(m.kickoff));
  if (today.length === 0) return null;

  const order = { live: 0, scheduled: 1, finished: 2 } as const;
  today.sort(
    (a, b) =>
      order[a.status] - order[b.status] ||
      (a.kickoff?.getTime() ?? 0) - (b.kickoff?.getTime() ?? 0),
  );

  const liveMatches = today.filter((m) => m.status === "live");
  const code = (team: string) => TEAM_BY_NAME.get(team)?.fifaCode ?? team;

  const noneToday =
    selected &&
    selected.teams.length > 0 &&
    !today.some(
      (m) => selected.teams.includes(m.team1) || selected.teams.includes(m.team2),
    );

  return (
    <div className="border-b border-edge">
      {/* Big live banner when a match is in progress */}
      {liveMatches.map((m) => {
        const owner1 = ownerOf(m.team1);
        const owner2 = ownerOf(m.team2);
        const isMine =
          selected &&
          (selected.teams.includes(m.team1) || selected.teams.includes(m.team2));
        return (
          <Link
            key={m.id}
            to="/live"
            className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent/5"
            style={{
              background: isMine
                ? `linear-gradient(90deg, ${selected!.colour}18, transparent)`
                : "linear-gradient(90deg, rgba(239,68,68,0.07), transparent)",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-black uppercase tracking-widest text-red-500">
                Live
              </span>
              <span className="text-soft">{m.clock ?? ""}</span>
            </div>

            <div className="flex flex-1 items-center justify-center gap-2">
              {isRealTeam(m.team1) && (
                <>
                  <span
                    className="font-bold"
                    style={owner1 ? { color: owner1.colour } : undefined}
                  >
                    {code(m.team1)}
                  </span>
                  <span className="text-xl font-black tabular-nums">
                    {m.score1 ?? 0}&nbsp;–&nbsp;{m.score2 ?? 0}
                  </span>
                  <span
                    className="font-bold"
                    style={owner2 ? { color: owner2.colour } : undefined}
                  >
                    {code(m.team2)}
                  </span>
                </>
              )}
            </div>

            <span className="shrink-0 text-xs text-soft">tap to open →</span>
          </Link>
        );
      })}

      {/* Compact today strip */}
      <div className="flex items-center gap-2 overflow-x-auto px-4 py-1.5">
        {noneToday ? (
          <span className="text-xs text-soft">
            None of {selected!.name}'s teams play today
          </span>
        ) : (
          <>
            <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-soft">
              📅 Today
            </span>
            {today.map((m) => (
              <Link
                key={m.id}
                to="/live"
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-cream ${
                  m.status === "live"
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-edge"
                }`}
              >
                {m.status === "live" && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                )}
                <span>{isRealTeam(m.team1) ? code(m.team1) : "TBD"}</span>
                {m.status === "scheduled" ? (
                  <span className="text-soft">
                    {m.kickoff ? fmtTime(m.kickoff) : "TBC"}
                  </span>
                ) : (
                  <span className="tabular-nums">
                    {m.score1 ?? 0}–{m.score2 ?? 0}
                    {m.status === "live" && m.clock ? ` ${m.clock}` : ""}
                    {m.status === "finished" ? " FT" : ""}
                  </span>
                )}
                <span>{isRealTeam(m.team2) ? code(m.team2) : "TBD"}</span>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
