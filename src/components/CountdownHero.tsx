import { useEffect, useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { TeamFlag } from "./TeamFlag";
import { isRealTeam } from "../lib/parse";
import { fmtDate, fmtTime } from "../lib/format";

// Big animated countdown to the opening match. Disappears at kick-off
// and never comes back — the LiveBanner takes over from there.
export function CountdownHero() {
  const { matches } = useData();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const opener = useMemo(() => {
    const withKick = matches.filter((m) => m.kickoff !== null);
    withKick.sort((a, b) => a.kickoff!.getTime() - b.kickoff!.getTime());
    return withKick[0];
  }, [matches]);

  if (!opener?.kickoff) return null;
  const ms = opener.kickoff.getTime() - now;
  if (ms <= 0) return null;

  const total = Math.floor(ms / 1000);
  const parts = [
    { v: Math.floor(total / 86400), label: "days" },
    { v: Math.floor((total % 86400) / 3600), label: "hrs" },
    { v: Math.floor((total % 3600) / 60), label: "mins" },
    { v: total % 60, label: "secs" },
  ];

  return (
    <section
      className="overflow-hidden rounded-2xl text-white shadow-lg"
      style={{
        background:
          "linear-gradient(120deg, #1a1a2e, #16213e, #41295a, #1a1a2e)",
        backgroundSize: "300% 300%",
        animation: "hero-sheen 12s ease-in-out infinite",
      }}
    >
      <div className="px-6 py-6 text-center sm:py-8">
        <div className="text-xs font-bold uppercase tracking-[0.3em] text-tangerine">
          World Cup 2026
        </div>
        <div className="mt-1 text-2xl font-black sm:text-3xl">Kick-off in</div>
        <div className="mt-4 flex justify-center gap-2 sm:gap-3">
          {parts.map((p) => (
            <div
              key={p.label}
              className="w-16 rounded-xl bg-white/10 px-2 py-3 sm:w-20"
            >
              <div className="text-3xl font-black tabular-nums sm:text-4xl">
                {String(p.v).padStart(2, "0")}
              </div>
              <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                {p.label}
              </div>
            </div>
          ))}
        </div>
        {isRealTeam(opener.team1) && isRealTeam(opener.team2) && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-white/90">
            <TeamFlag team={opener.team1} size={20} />
            <span>{opener.team1}</span>
            <span className="text-white/50">v</span>
            <span>{opener.team2}</span>
            <TeamFlag team={opener.team2} size={20} />
            <span className="text-white/50">
              · {opener.ground ? `${opener.ground} · ` : ""}
              {fmtDate(opener.kickoff)} {fmtTime(opener.kickoff)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
