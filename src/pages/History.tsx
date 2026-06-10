import { useState } from "react";
import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { MatchCard } from "../components/MatchCard";
import { fmtDate, dayKey } from "../lib/format";
import type { WCMatch } from "../types";

export function History() {
  const { matches } = useData();
  const { selected } = useParticipant();
  const [mineOnly, setMineOnly] = useState(false);

  let results = matches.filter((m) => m.status === "finished" && m.kickoff);
  const filterActive = selected !== null && selected.teams.length > 0;
  if (filterActive && mineOnly) {
    results = results.filter(
      (m) => selected.teams.includes(m.team1) || selected.teams.includes(m.team2),
    );
  }
  results.sort((a, b) => b.kickoff!.getTime() - a.kickoff!.getTime());

  const byDay = new Map<string, WCMatch[]>();
  for (const m of results) {
    const key = dayKey(m.kickoff!);
    const list = byDay.get(key) ?? [];
    list.push(m);
    byDay.set(key, list);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Results</h2>
        {filterActive && (
          <button
            onClick={() => setMineOnly((v) => !v)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              mineOnly
                ? "border-transparent text-white"
                : "border-edge bg-card text-soft"
            }`}
            style={mineOnly ? { backgroundColor: selected.colour } : undefined}
          >
            {mineOnly ? `Showing ${selected.name}'s matches` : "Show mine only"}
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-edge bg-card p-6 text-center text-soft shadow-sm">
          No results yet — the tournament kicks off on 11 June 2026. Once games
          finish they'll show up here.
        </div>
      ) : (
        [...byDay.entries()].map(([key, list]) => (
          <section key={key} className="mb-4">
            <h3 className="sticky top-0 z-10 mb-2 bg-cream py-1 text-sm font-bold text-soft">
              {fmtDate(list[0].kickoff!)}
            </h3>
            <div className="space-y-2">
              {list.map((m) => {
                const mine =
                  filterActive &&
                  (selected.teams.includes(m.team1) ||
                    selected.teams.includes(m.team2));
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    showScorers
                    highlightColour={mine ? selected.colour : undefined}
                  />
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
