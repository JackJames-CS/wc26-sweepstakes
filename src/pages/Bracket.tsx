import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { buildBracket, championOf } from "../lib/bracket";
import { isRealTeam, placeholderLabel } from "../lib/parse";
import { TEAM_BY_NAME } from "../data/teams";
import { ownerOf } from "../config/participants";
import { TeamFlag } from "../components/TeamFlag";
import { fmtDate } from "../lib/format";
import type { WCMatch } from "../types";

function BracketTeam({
  name,
  score,
  winner,
}: {
  name: string;
  score: number | null;
  winner: boolean;
}) {
  if (!isRealTeam(name)) {
    return (
      <div className="px-2 py-1.5 text-[11px] font-medium text-soft">
        {placeholderLabel(name)}
      </div>
    );
  }
  const owner = ownerOf(name);
  const code = TEAM_BY_NAME.get(name)?.fifaCode ?? name;
  return (
    <Link
      to={`/teams/${encodeURIComponent(name)}`}
      title={name}
      className={`flex items-center gap-1.5 px-2 py-1 text-xs hover:bg-cream ${
        winner ? "font-extrabold" : "font-medium"
      }`}
    >
      <TeamFlag team={name} size={16} />
      <span>{code}</span>
      {owner && (
        <span
          title={owner.name}
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: owner.colour }}
        />
      )}
      <span className="ml-auto tabular-nums">{score ?? ""}</span>
    </Link>
  );
}

function BracketCell({ m }: { m: WCMatch }) {
  const decided =
    m.status === "finished" && m.score1 !== null && m.score2 !== null;
  return (
    <div
      className={`overflow-hidden rounded-lg border bg-card shadow-sm ${
        m.status === "live" ? "border-accent" : "border-edge"
      }`}
    >
      <div className="flex items-center justify-between border-b border-edge bg-cream/60 px-2 py-0.5 text-[10px] text-soft">
        <span>{m.kickoff ? fmtDate(m.kickoff) : ""}</span>
        {m.status === "live" && (
          <span className="flex items-center gap-1 font-bold text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            {m.clock ?? "LIVE"}
          </span>
        )}
      </div>
      <BracketTeam
        name={m.team1}
        score={m.score1}
        winner={decided && m.score1! > m.score2!}
      />
      <div className="border-t border-edge" />
      <BracketTeam
        name={m.team2}
        score={m.score2}
        winner={decided && m.score2! > m.score1!}
      />
    </div>
  );
}

export function Bracket() {
  const { matches } = useData();
  const { columns, final, thirdPlace } = buildBracket(matches);
  const champion = championOf(final);
  const champOwner = champion ? ownerOf(champion) : undefined;

  if (columns.length === 0 && !final) {
    return <p className="text-soft">Knockout fixtures aren't available yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">🏆 Knockout bracket</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3 sm:gap-4">
          {columns.map((c) => (
            <div key={c.name} className="flex w-40 flex-col sm:w-44">
              <div className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-soft">
                {c.name}
              </div>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {c.matches.map((m) => (
                  <BracketCell key={m.id} m={m} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex w-44 flex-col sm:w-48">
            <div className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-soft">
              Final
            </div>
            <div className="flex flex-1 flex-col justify-center gap-4">
              {champion && (
                <div className="rounded-xl border-2 border-tangerine bg-card p-3 text-center shadow-sm">
                  <div className="text-2xl">🏆</div>
                  <div className="flex items-center justify-center gap-2 font-extrabold">
                    <TeamFlag team={champion} size={20} />
                    {champion}
                  </div>
                  <div className="mt-0.5 text-xs text-soft">
                    World Champions
                    {champOwner ? ` — ${champOwner.name} wins the pot! 💰` : ""}
                  </div>
                </div>
              )}
              {final && <BracketCell m={final} />}
              {thirdPlace && (
                <div>
                  <div className="mb-1 text-center text-[10px] font-bold uppercase tracking-wide text-soft">
                    Third place
                  </div>
                  <BracketCell m={thirdPlace} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-soft">
        Fills in automatically as teams qualify — Round of 32 starts 28 June.
        Coloured dots mark who drew each team.
      </p>
    </div>
  );
}
