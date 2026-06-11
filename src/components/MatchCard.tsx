import type { WCMatch } from "../types";
import { isRealTeam, placeholderLabel } from "../lib/parse";
import { fmtDate, fmtTime } from "../lib/format";
import { TeamFlag } from "./TeamFlag";
import { OwnerBadge } from "./OwnerBadge";
import { ownerOf } from "../config/participants";

function TeamSide({ team, alignRight }: { team: string; alignRight?: boolean }) {
  const real = isRealTeam(team);
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${
        alignRight ? "flex-row-reverse text-right" : ""
      }`}
    >
      {real ? (
        <>
          <TeamFlag team={team} size={24} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{team}</div>
            <OwnerBadge team={team} />
          </div>
        </>
      ) : (
        <div className="text-sm font-medium text-soft">{placeholderLabel(team)}</div>
      )}
    </div>
  );
}

export function MatchCard({
  match,
  highlightColour,
  showScorers = false,
}: {
  match: WCMatch;
  highlightColour?: string;
  showScorers?: boolean;
}) {
  const { status } = match;
  const centre =
    status === "scheduled" ? (
      <div className="text-center">
        <div className="text-sm font-bold">
          {match.kickoff ? fmtTime(match.kickoff) : "TBC"}
        </div>
        <div className="text-xs text-soft">
          {match.kickoff ? fmtDate(match.kickoff) : ""}
        </div>
      </div>
    ) : (
      <div className="text-center">
        <div
          key={`${match.score1}:${match.score2}`}
          className={`text-xl font-extrabold tabular-nums ${
            status === "live" ? "animate-score-pop" : ""
          }`}
        >
          {match.score1 ?? "–"} : {match.score2 ?? "–"}
        </div>
        {status === "live" ? (
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            LIVE {match.clock ?? ""}
          </div>
        ) : (
          <div className="text-xs text-soft">FT</div>
        )}
      </div>
    );

  const owner1 = ownerOf(match.team1);
  const owner2 = ownerOf(match.team2);
  const isH2H =
    owner1 && owner2 && owner1.id !== owner2.id &&
    (match.status === "scheduled" || match.status === "live");

  return (
    <div
      className="rounded-xl border border-edge bg-card p-3 shadow-sm"
      style={
        highlightColour
          ? { borderColor: highlightColour, borderWidth: 2 }
          : undefined
      }
    >
      <div className="mb-1 text-xs font-medium text-soft">
        {match.stage}
        {match.ground ? ` · ${match.ground}` : ""}
      </div>
      <div className="flex items-center gap-3">
        <TeamSide team={match.team1} />
        {centre}
        <TeamSide team={match.team2} alignRight />
      </div>
      {isH2H && (
        <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-cream px-3 py-1 text-xs font-semibold">
          🔥{" "}
          <span style={{ color: owner1.colour }}>{owner1.name}</span>
          <span className="text-soft">vs</span>
          <span style={{ color: owner2.colour }}>{owner2.name}</span>
        </div>
      )}
      {(showScorers || status === "live") &&
        (match.goals1.length > 0 || match.goals2.length > 0) && (
        <div className="mt-2 flex justify-between gap-2 border-t border-edge pt-2 text-xs text-soft">
          <div>
            {match.goals1.map((g, i) => (
              <div key={i}>
                ⚽ {g.name} {g.minute}'{g.penalty ? " (pen)" : ""}
                {g.owngoal ? " (og)" : ""}
              </div>
            ))}
          </div>
          <div className="text-right">
            {match.goals2.map((g, i) => (
              <div key={i}>
                ⚽ {g.name} {g.minute}'{g.penalty ? " (pen)" : ""}
                {g.owngoal ? " (og)" : ""}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
