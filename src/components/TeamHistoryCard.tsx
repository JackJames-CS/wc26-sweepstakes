import { TEAM_HISTORY, getH2H } from "../data/teamHistory";
import { TEAM_BY_NAME } from "../data/teams";

export function TeamHistoryCard({ fifaCode }: { fifaCode: string }) {
  const history = TEAM_HISTORY[fifaCode];
  if (!history) return null;

  return (
    <section className="rounded-xl border border-edge bg-card p-4 shadow-sm">
      <h2 className="mb-2 font-bold">World Cup History</h2>
      <dl className="space-y-1 text-sm">
        {history.titles.length > 0 && (
          <div className="flex gap-2">
            <dt className="shrink-0">🏆 Winners:</dt>
            <dd className="font-semibold">{history.titles.join(", ")}</dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="shrink-0 text-soft">📊 Appearances:</dt>
          <dd>{history.appearances}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-soft">Best finish:</dt>
          <dd>{history.bestFinish}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 text-soft">Last tournament:</dt>
          <dd>{history.lastTournament}</dd>
        </div>
      </dl>
      <p className="mt-3 border-t border-edge pt-2 text-sm italic text-soft">
        “{history.flavour}”
      </p>
    </section>
  );
}

export function H2HCard({ team1, team2 }: { team1: string; team2: string }) {
  const code1 = TEAM_BY_NAME.get(team1)?.fifaCode;
  const code2 = TEAM_BY_NAME.get(team2)?.fifaCode;
  if (!code1 || !code2) return null;

  const h2h = getH2H(code1, code2);
  if (!h2h) return null;

  return (
    <div className="rounded-xl border border-edge bg-card p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-bold">
        {team1} vs {team2} — World Cup H2H
      </h3>
      <ul className="space-y-1 text-sm">
        {h2h.meetings.map((m) => (
          <li key={`${m.year}-${m.stage}`}>
            <span className="font-semibold">{m.year}</span>{" "}
            <span className="text-soft">{m.stage}:</span> {m.result}
          </li>
        ))}
      </ul>
      <p className="mt-2 border-t border-edge pt-2 text-xs font-medium text-soft">
        {h2h.summary}
      </p>
    </div>
  );
}
