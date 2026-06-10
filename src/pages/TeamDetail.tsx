import { Link, useParams } from "react-router-dom";
import { TEAM_BY_NAME } from "../data/teams";
import { ownerOf } from "../config/participants";
import { useData } from "../context/DataContext";
import { STATUS_ICON, STATUS_LABEL } from "../lib/status";
import { GroupTable } from "../components/GroupTable";
import { MatchCard } from "../components/MatchCard";
import { TeamFlag } from "../components/TeamFlag";

export function TeamDetail() {
  const { name } = useParams();
  const teamName = name ? decodeURIComponent(name) : "";
  const team = TEAM_BY_NAME.get(teamName);
  const { matches, standings, statuses } = useData();

  if (!team) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-soft">Unknown team.</p>
        <Link to="/teams" className="font-semibold text-accent hover:underline">
          ← All teams
        </Link>
      </div>
    );
  }

  const owner = ownerOf(team.name);
  const s = statuses.get(team.name) ?? "group";
  const theirMatches = matches.filter(
    (m) => m.team1 === team.name || m.team2 === team.name,
  );
  const played = theirMatches.filter((m) => m.status !== "scheduled");
  const upcoming = theirMatches.filter((m) => m.status === "scheduled");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/teams" className="text-sm font-semibold text-accent hover:underline">
        ← All teams
      </Link>

      <div className="flex items-center gap-4 rounded-xl border border-edge bg-card p-4 shadow-sm">
        <TeamFlag team={team.name} size={56} />
        <div>
          <h1 className="text-xl font-extrabold">
            {team.name} <span className="text-soft">({team.fifaCode})</span>
          </h1>
          <div className="text-sm text-soft">
            Group {team.group} · {STATUS_ICON[s]} {STATUS_LABEL[s]}
          </div>
          {owner && (
            <div className="mt-1 text-sm">
              Drawn by{" "}
              <span
                className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                style={{ backgroundColor: owner.colour }}
              >
                {owner.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {standings.get(team.group) && (
        <GroupTable group={team.group} rows={standings.get(team.group)!} />
      )}

      {played.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold">Results</h2>
          <div className="space-y-2">
            {played.map((m) => (
              <MatchCard key={m.id} match={m} showScorers />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-2 font-bold">Upcoming</h2>
          <div className="space-y-2">
            {upcoming.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
