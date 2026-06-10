import type { StandingRow } from "../types";
import { useParticipant } from "../context/ParticipantContext";
import { TeamFlag } from "./TeamFlag";
import { OwnerBadge } from "./OwnerBadge";
import { Link } from "react-router-dom";

export function GroupTable({
  group,
  rows,
}: {
  group: string;
  rows: StandingRow[];
}) {
  const { selected } = useParticipant();
  return (
    <div className="rounded-xl border border-edge bg-card p-4 shadow-sm">
      <h3 className="mb-2 font-bold">Group {group}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-soft">
            <th className="w-full pb-1 font-medium">Team</th>
            <th className="px-1.5 pb-1 text-center font-medium">P</th>
            <th className="hidden px-1.5 pb-1 text-center font-medium sm:table-cell">W</th>
            <th className="hidden px-1.5 pb-1 text-center font-medium sm:table-cell">D</th>
            <th className="hidden px-1.5 pb-1 text-center font-medium sm:table-cell">L</th>
            <th className="px-1.5 pb-1 text-center font-medium">GD</th>
            <th className="px-1.5 pb-1 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const mine = selected?.teams.includes(r.team);
            return (
              <tr
                key={r.team}
                className={`border-t border-edge ${
                  i <= 1
                    ? "border-l-4 border-l-green-500"
                    : i === 2
                      ? "border-l-4 border-l-amber-400"
                      : "border-l-4 border-l-transparent"
                }`}
                style={mine ? { backgroundColor: `${selected!.colour}1A` } : undefined}
              >
                <td className="py-1.5 pl-2">
                  <Link
                    to={`/teams/${encodeURIComponent(r.team)}`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    <TeamFlag team={r.team} size={20} />
                    <span className="truncate font-medium">{r.team}</span>
                    <OwnerBadge team={r.team} />
                  </Link>
                </td>
                <td className="px-1.5 text-center tabular-nums">{r.played}</td>
                <td className="hidden px-1.5 text-center tabular-nums sm:table-cell">{r.won}</td>
                <td className="hidden px-1.5 text-center tabular-nums sm:table-cell">{r.drawn}</td>
                <td className="hidden px-1.5 text-center tabular-nums sm:table-cell">{r.lost}</td>
                <td className="px-1.5 text-center tabular-nums">
                  {r.gd > 0 ? `+${r.gd}` : r.gd}
                </td>
                <td className="px-1.5 text-center font-bold tabular-nums">{r.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
