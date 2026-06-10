import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { GroupTable } from "../components/GroupTable";
import { TeamFlag } from "../components/TeamFlag";
import { TEAM_BY_NAME } from "../data/teams";

export function Groups() {
  const { standings } = useData();
  const { selected } = useParticipant();
  const groups = [...standings.keys()].sort();

  return (
    <div className="mx-auto max-w-5xl">
      {selected && selected.teams.length > 0 && (
        <div
          className="mb-4 rounded-xl border-2 bg-card p-3 shadow-sm"
          style={{ borderColor: selected.colour }}
        >
          <div className="mb-1 text-sm font-bold">{selected.name}'s teams</div>
          <div className="flex flex-wrap gap-3 text-sm">
            {selected.teams.map((t) => {
              const g = TEAM_BY_NAME.get(t)?.group;
              const rows = g ? standings.get(g) : undefined;
              const pos = rows ? rows.findIndex((r) => r.team === t) + 1 : 0;
              return (
                <span key={t} className="flex items-center gap-1.5">
                  <TeamFlag team={t} size={18} />
                  {t}
                  <span className="text-soft">
                    — Group {g}, {pos > 0 ? `${pos}${["st", "nd", "rd"][pos - 1] ?? "th"}` : "?"}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <GroupTable key={g} group={g} rows={standings.get(g)!} />
        ))}
      </div>
      <p className="mt-4 text-xs text-soft">
        <span className="font-medium text-green-600">Green</span> = top two,
        qualify automatically · <span className="font-medium text-amber-500">Amber</span>{" "}
        = third place, may qualify among the 8 best third-placed teams
      </p>
    </div>
  );
}
