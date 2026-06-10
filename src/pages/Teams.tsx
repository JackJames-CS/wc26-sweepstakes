import { Link } from "react-router-dom";
import { TEAMS } from "../data/teams";
import { ownerOf } from "../config/participants";
import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { STATUS_ICON } from "../lib/status";
import { TeamFlag } from "../components/TeamFlag";

export function Teams() {
  const { standings, statuses } = useData();
  const { selected } = useParticipant();

  const filterActive = selected !== null && selected.teams.length > 0;
  const mine = filterActive
    ? TEAMS.filter((t) => selected.teams.includes(t.name))
    : [];
  const rest = filterActive
    ? TEAMS.filter((t) => !selected.teams.includes(t.name))
    : TEAMS;

  const card = (t: (typeof TEAMS)[number], highlighted: boolean) => {
    const owner = ownerOf(t.name);
    const rows = standings.get(t.group);
    const pos = rows ? rows.findIndex((r) => r.team === t.name) + 1 : 0;
    const pts = rows?.find((r) => r.team === t.name)?.pts ?? 0;
    const s = statuses.get(t.name) ?? "group";
    return (
      <Link
        key={t.name}
        to={`/teams/${encodeURIComponent(t.name)}`}
        className={`rounded-xl border bg-card p-3 shadow-sm transition-transform hover:-translate-y-0.5 ${
          highlighted ? "border-2" : "border-edge"
        } ${filterActive && !highlighted ? "opacity-60" : ""}`}
        style={highlighted ? { borderColor: selected!.colour } : undefined}
      >
        <div className="flex items-center gap-2">
          <TeamFlag team={t.name} size={28} />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">
              {t.name} {STATUS_ICON[s]}
            </div>
            <div className="text-xs text-soft">
              Group {t.group}
              {pos > 0 ? ` · ${pos}${["st", "nd", "rd"][pos - 1] ?? "th"} · ${pts} pts` : ""}
            </div>
          </div>
        </div>
        <div className="mt-2">
          {owner ? (
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
              style={{ backgroundColor: owner.colour }}
            >
              {owner.name}
            </span>
          ) : (
            <span className="text-xs text-soft">Unowned</span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      {filterActive && (
        <>
          <h2 className="mb-3 text-lg font-bold">
            {selected.name}'s teams ({mine.length})
          </h2>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {mine.map((t) => card(t, true))}
          </div>
          <h2 className="mb-3 text-lg font-bold text-soft">Everyone else</h2>
        </>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {rest.map((t) => card(t, false))}
      </div>
    </div>
  );
}
