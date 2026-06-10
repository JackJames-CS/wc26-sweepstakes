import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { buildBulletin, type Story } from "../lib/stories";
import { fmtDate } from "../lib/format";

function StoryText({ story }: { story: Story }) {
  if (!story.to) return <>{story.text}</>;
  return (
    <Link to={story.to} className="hover:underline">
      {story.text}
    </Link>
  );
}

// "The Daily Sweep" — commentary on the sweepstake, regenerated each day.
export function DailyBulletin() {
  const { matches, statuses } = useData();
  const [shuffle, setShuffle] = useState(0);
  const bulletin = useMemo(
    () => buildBulletin(matches, statuses, shuffle),
    [matches, statuses, shuffle],
  );

  if (!bulletin) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-edge bg-card shadow-sm">
      <div className="flex items-baseline justify-between border-b-2 border-ink px-4 py-2">
        <span className="text-sm font-black uppercase tracking-[0.2em]">
          📰 The Daily Sweep
        </span>
        <span className="text-[11px] font-medium text-soft">
          {fmtDate(new Date())}
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-black uppercase leading-tight tracking-tight sm:text-2xl">
          {bulletin.headline.emoji} <StoryText story={bulletin.headline} />
        </h2>
        {bulletin.lines.length > 0 && (
          <ul className="mt-3 space-y-1.5 border-t border-edge pt-3 text-sm">
            {bulletin.lines.map((s, i) => (
              <li key={`${shuffle}-${i}`} className="flex gap-2">
                <span className="shrink-0">{s.emoji}</span>
                <span>
                  <StoryText story={s} />
                </span>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => setShuffle((n) => n + 1)}
          className="mt-3 rounded-full border border-edge px-3 py-1 text-xs font-semibold text-soft hover:bg-cream"
        >
          ↻ more stories
        </button>
      </div>
    </section>
  );
}
