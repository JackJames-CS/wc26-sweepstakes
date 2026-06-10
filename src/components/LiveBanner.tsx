import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { isToday, fmtTime } from "../lib/format";
import { TEAM_BY_NAME } from "../data/teams";
import { isRealTeam } from "../lib/parse";

export function LiveBanner() {
  const { matches } = useData();
  const { selected } = useParticipant();

  let today = matches.filter((m) => isToday(m.kickoff));
  if (today.length === 0) return null;

  if (selected && selected.teams.length > 0) {
    today = today.filter(
      (m) => selected.teams.includes(m.team1) || selected.teams.includes(m.team2),
    );
    if (today.length === 0) {
      return (
        <div className="border-b border-edge bg-card px-4 py-1.5 text-xs text-soft">
          None of {selected.name}'s teams play today
        </div>
      );
    }
  }

  const order = { live: 0, scheduled: 1, finished: 2 } as const;
  today.sort(
    (a, b) =>
      order[a.status] - order[b.status] ||
      (a.kickoff?.getTime() ?? 0) - (b.kickoff?.getTime() ?? 0),
  );

  const code = (team: string) => TEAM_BY_NAME.get(team)?.fifaCode ?? team;

  return (
    <div className="overflow-x-auto border-b border-edge bg-card">
      <div className="flex items-center gap-2 px-4 py-2">
        <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-soft">
          📅 Today
        </span>
        {today.map((m) => (
          <span
            key={m.id}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
              m.status === "live" ? "border-accent bg-accent/10" : "border-edge"
            }`}
          >
            {m.status === "live" && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
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
          </span>
        ))}
      </div>
    </div>
  );
}
