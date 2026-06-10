import { Link } from "react-router-dom";
import { useSquads } from "../hooks/useSquads";
import { groupByPosition, POS_LABEL } from "../lib/players";

export function SquadList({ team }: { team: string }) {
  const { squads, error } = useSquads();

  if (error) return null;
  if (!squads) {
    return <p className="text-sm text-soft">Loading squad…</p>;
  }
  const squad = squads[team];
  if (!squad?.length) return null;

  return (
    <section>
      <h2 className="mb-2 font-bold">Squad</h2>
      <div className="space-y-4 rounded-xl border border-edge bg-card p-4 shadow-sm">
        {groupByPosition(squad).map(([pos, players]) => (
          <div key={pos}>
            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-soft">
              {POS_LABEL[pos] ?? pos}
            </h3>
            <ul className="divide-y divide-edge">
              {players.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/teams/${encodeURIComponent(team)}/players/${p.id}`}
                    className="flex items-center gap-3 py-1.5 hover:bg-edge/30"
                  >
                    <span className="w-6 shrink-0 text-right font-mono text-sm text-soft">
                      {p.jersey ?? "–"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {p.name}
                    </span>
                    {p.club && (
                      <span className="flex min-w-0 items-center gap-1.5 text-xs text-soft">
                        {p.clubLogo && (
                          <img
                            src={p.clubLogo}
                            alt=""
                            className="h-4 w-4 shrink-0"
                            loading="lazy"
                          />
                        )}
                        <span className="hidden truncate sm:inline">{p.club}</span>
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
