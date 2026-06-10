import { Link, useParams } from "react-router-dom";
import { TEAM_BY_NAME } from "../data/teams";
import { ownerOf } from "../config/participants";
import { useData } from "../context/DataContext";
import { useSquads } from "../hooks/useSquads";
import { goalsForPlayer, POS_NAME } from "../lib/players";
import { TeamFlag } from "../components/TeamFlag";

function fmtDob(dob: string): string {
  const d = new Date(dob + "T00:00:00Z");
  return d.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function PlayerDetail() {
  const { name, pid } = useParams();
  const teamName = name ? decodeURIComponent(name) : "";
  const team = TEAM_BY_NAME.get(teamName);
  const { squads, error } = useSquads();
  const { matches } = useData();

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

  const backLink = (
    <Link
      to={`/teams/${encodeURIComponent(team.name)}`}
      className="text-sm font-semibold text-accent hover:underline"
    >
      ← {team.name}
    </Link>
  );

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {backLink}
        <p className="text-soft">Squad data unavailable.</p>
      </div>
    );
  }
  if (!squads) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {backLink}
        <p className="text-sm text-soft">Loading player…</p>
      </div>
    );
  }

  const player = squads[team.name]?.find((p) => p.id === pid);
  if (!player) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {backLink}
        <p className="text-soft">Unknown player.</p>
      </div>
    );
  }

  const owner = ownerOf(team.name);
  const goals = goalsForPlayer(matches, team.name, player);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {backLink}

      <div className="flex items-center gap-4 rounded-xl border border-edge bg-card p-4 shadow-sm">
        <span className="w-14 shrink-0 text-center font-mono text-3xl font-extrabold text-soft">
          {player.jersey ?? "–"}
        </span>
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold">{player.name}</h1>
          <div className="flex flex-wrap items-center gap-x-2 text-sm text-soft">
            <span>{POS_NAME[player.pos] ?? player.pos}</span>
            <span>·</span>
            <Link
              to={`/teams/${encodeURIComponent(team.name)}`}
              className="inline-flex items-center gap-1 hover:underline"
            >
              <TeamFlag team={team.name} size={16} />
              {team.name}
            </Link>
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

      <section className="rounded-xl border border-edge bg-card p-4 shadow-sm">
        <h2 className="mb-2 font-bold">Profile</h2>
        <dl className="space-y-1 text-sm">
          {player.club && (
            <div className="flex items-center gap-2">
              <dt className="w-24 shrink-0 text-soft">Club</dt>
              <dd className="flex items-center gap-1.5 font-medium">
                {player.clubLogo && (
                  <img src={player.clubLogo} alt="" className="h-5 w-5" />
                )}
                {player.club}
              </dd>
            </div>
          )}
          {player.age != null && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-soft">Age</dt>
              <dd>
                {player.age}
                {player.dob && (
                  <span className="text-soft"> (born {fmtDob(player.dob)})</span>
                )}
              </dd>
            </div>
          )}
          {player.heightCm != null && (
            <div className="flex gap-2">
              <dt className="w-24 shrink-0 text-soft">Height</dt>
              <dd>{player.heightCm} cm</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="rounded-xl border border-edge bg-card p-4 shadow-sm">
        <h2 className="mb-2 font-bold">World Cup 2026</h2>
        {goals.length === 0 ? (
          <p className="text-sm text-soft">No goals yet this tournament.</p>
        ) : (
          <>
            <p className="mb-2 text-sm font-semibold">
              ⚽ {goals.length} goal{goals.length === 1 ? "" : "s"}
            </p>
            <ul className="space-y-1 text-sm">
              {goals.map(({ match, opponent, goal }, i) => (
                <li key={`${match.id}-${i}`}>
                  <span className="font-mono text-soft">
                    {goal.minute}
                    {goal.offset ? `+${goal.offset}` : ""}′
                  </span>{" "}
                  vs {opponent}
                  {goal.penalty && <span className="text-soft"> (pen)</span>}
                  <span className="text-soft"> · {match.stage}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
