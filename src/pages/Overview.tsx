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
import { TEAM_BY_NAME } from "../data/teams";

export function Overview() {
  const { matches, statuses, goldenBoot } = useData();
  const { selected } = useParticipant();

  // Commiseration: participants whose every team is eliminated
  const eliminatedParticipants = drawDone
    ? participants.filter(
        (p) =>
          p.teams.length > 0 &&
          p.teams.every((t) => !isAlive(statuses.get(t) ?? "group")),
      )
    : [];

  // WhatsApp share text for the selected participant
  function buildShareText(p: typeof participants[0]): string {
    const lines: string[] = [`WC26 Sweepstakes 🏆`, `${p.name}'s teams:`];
    for (const t of p.teams) {
      const s = statuses.get(t) ?? "group";
      const group = TEAM_BY_NAME.get(t)?.group ?? "?";
      lines.push(`${STATUS_ICON[s]} ${t} · Group ${group}`);
    }
    return lines.join("\n");
  }

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

      {eliminatedParticipants.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">💀 Out of the tournament</h2>
          <div className="space-y-2">
            {eliminatedParticipants.map((p) => {
              const isSel = selected?.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-xl border-2 bg-card p-3 shadow-sm ${
                    isSel ? "shadow-md" : "opacity-80"
                  }`}
                  style={{ borderColor: p.colour }}
                >
                  <span
                    className="font-bold"
                    style={{ color: p.colour }}
                  >
                    💀 {p.name}'s teams are all out!
                  </span>
                  {isSel && (
                    <p className="mt-1 text-sm text-soft">
                      Better luck next time, {p.name} 😢
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

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
                {isSel && p.teams.length > 0 && (
                  <div className="mt-2 pl-4">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(buildShareText(p))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 hover:bg-green-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 fill-current"
                        aria-hidden="true"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Share on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
