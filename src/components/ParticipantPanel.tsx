import { participants } from "../config/participants";
import { useParticipant } from "../context/ParticipantContext";
import { useData } from "../context/DataContext";
import { isToday, countdown } from "../lib/format";
import { TeamFlag } from "./TeamFlag";

export function ParticipantPanel({ onSelect }: { onSelect?: () => void }) {
  const { selected, toggle, clear } = useParticipant();
  const { matches } = useData();

  // Teams kicking off later today → countdown chips
  const upcomingToday = matches.filter(
    (m) => m.status === "scheduled" && isToday(m.kickoff),
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-soft">
          Players
        </h2>
        {selected && (
          <button
            onClick={clear}
            className="rounded-full bg-edge px-2 py-0.5 text-xs font-medium hover:bg-accent hover:text-white"
          >
            ✕ Clear
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {participants.map((p) => {
          const active = selected?.id === p.id;
          const nextKickoff = upcomingToday.find(
            (m) => p.teams.includes(m.team1) || p.teams.includes(m.team2),
          );
          return (
            <button
              key={p.id}
              onClick={() => {
                toggle(p.id);
                onSelect?.();
              }}
              className="block w-full border-l-4 px-3 py-2 text-left transition-colors hover:bg-cream"
              style={{
                borderLeftColor: active ? p.colour : "transparent",
                backgroundColor: active ? `${p.colour}1A` : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.colour }}
                />
                <span className="font-semibold">{p.name}</span>
              </div>
              {p.teams.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1 pl-4">
                  {p.teams.map((t) => (
                    <TeamFlag key={t} team={t} size={18} />
                  ))}
                </div>
              ) : (
                <div className="pl-4 text-xs text-soft">draw pending</div>
              )}
              {nextKickoff && nextKickoff.kickoff && (
                <div className="mt-1 pl-4 text-xs font-medium text-accent">
                  ⏱{" "}
                  {p.teams.includes(nextKickoff.team1)
                    ? nextKickoff.team1
                    : nextKickoff.team2}{" "}
                  kicks off in {countdown(nextKickoff.kickoff)}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
