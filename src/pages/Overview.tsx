import { Link } from "react-router-dom";
import { participants, drawDone } from "../config/participants";
import { useData } from "../context/DataContext";
import { useParticipant } from "../context/ParticipantContext";
import { STATUS_ICON, STATUS_LABEL, isAlive } from "../lib/status";
import { MatchCard } from "../components/MatchCard";
import { TeamFlag } from "../components/TeamFlag";
import { CountdownHero } from "../components/CountdownHero";
import { DailyBulletin } from "../components/DailyBulletin";
import { fmtDate, fmtTime } from "../lib/format";

export function Overview() {
  const { matches, statuses, goldenBoot } = useData();
  const { selected } = useParticipant();

  let fixtures = matches.filter((m) => m.status === "scheduled" && m.kickoff);
  if (selected && selected.teams.length > 0) {
    fixtures = fixtures.filter(
      (m) => selected.teams.includes(m.team1) || selected.teams.includes(m.team2),
    );
  }
  fixtures.sort((a, b) => a.kickoff!.getTime() - b.kickoff!.getTime());
  fixtures = fixtures.slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <CountdownHero />

      <DailyBulletin />

      <section>
        <h2 className="mb-3 text-lg font-bold">The Pool</h2>
        {!drawDone && (
          <div className="mb-3 rounded-xl border border-tangerine bg-card p-4 shadow-sm">
            <div className="font-bold">🎲 The draw hasn't happened yet</div>
            <p className="mt-1 text-sm text-soft">
              {participants.length} players ready, 48 teams waiting. Once the
              draw is done, everyone's teams will show up here.
            </p>
          </div>
        )}
        <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
          {participants.map((p) => {
            const isSel = selected?.id === p.id;
            const alive = p.teams.filter((t) =>
              isAlive(statuses.get(t) ?? "group"),
            ).length;
            return (
              <div
                key={p.id}
                className="border-b border-edge px-4 py-2.5 last:border-b-0"
                style={isSel ? { backgroundColor: `${p.colour}1A` } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: p.colour }}
                  />
                  <span className="font-semibold">{p.name}</span>
                  <span className="ml-auto text-xs font-medium text-soft">
                    {p.teams.length > 0
                      ? `${alive}/${p.teams.length} alive`
                      : "draw pending"}
                  </span>
                </div>
                {p.teams.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-2 pl-4">
                    {p.teams.map((t) => {
                      const s = statuses.get(t) ?? "group";
                      return (
                        <Link
                          key={t}
                          to={`/teams/${encodeURIComponent(t)}`}
                          title={STATUS_LABEL[s]}
                          className={`flex items-center gap-1 rounded-full border border-edge px-2 py-0.5 text-xs font-medium hover:bg-cream ${
                            s === "eliminated" ? "opacity-50" : ""
                          }`}
                        >
                          <TeamFlag team={t} size={16} />
                          {t} {STATUS_ICON[s]}
                        </Link>
                      );
                    })}
                  </div>
                )}
                {isSel &&
                  p.teams.map((t) => {
                    const next = matches.find(
                      (m) =>
                        m.status === "scheduled" &&
                        (m.team1 === t || m.team2 === t),
                    );
                    if (!next || !next.kickoff) return null;
                    return (
                      <div key={t} className="mt-1 pl-4 text-xs text-soft">
                        {t} next: vs{" "}
                        {next.team1 === t ? next.team2 : next.team1} ·{" "}
                        {fmtDate(next.kickoff)} {fmtTime(next.kickoff)}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">
          Next fixtures{selected ? ` — ${selected.name}` : ""}
        </h2>
        {fixtures.length === 0 ? (
          <p className="text-sm text-soft">No upcoming fixtures found.</p>
        ) : (
          <div className="space-y-2">
            {fixtures.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </section>

      {goldenBoot.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">🥇 Golden Boot</h2>
          <div className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
            {goldenBoot.map((s, i) => {
              const owned = selected?.teams.includes(s.team);
              return (
                <div
                  key={`${s.name}-${s.team}`}
                  className="flex items-center gap-2 border-b border-edge px-4 py-2 text-sm last:border-b-0"
                  style={
                    owned
                      ? { backgroundColor: `${selected!.colour}1A` }
                      : undefined
                  }
                >
                  <span className="w-5 text-center font-bold text-soft">
                    {i + 1}
                  </span>
                  <TeamFlag team={s.team} size={18} />
                  <span className="font-medium">{s.name}</span>
                  <span className="ml-auto font-bold tabular-nums">
                    {s.goals} ⚽
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
