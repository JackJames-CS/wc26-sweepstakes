import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { ParticipantPanel } from "./ParticipantPanel";
import { LiveBanner } from "./LiveBanner";
import { GoalFlash } from "./GoalFlash";
import { useParticipant } from "../context/ParticipantContext";
import { useData } from "../context/DataContext";
import { minsAgo } from "../lib/format";

const tabs = [
  { to: "/", label: "Overview", end: true },
  { to: "/groups", label: "Groups" },
  { to: "/bracket", label: "Bracket" },
  { to: "/history", label: "History" },
  { to: "/stats", label: "Stats" },
  { to: "/teams", label: "Teams" },
];

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { selected, clear } = useParticipant();
  const { lastUpdated, error, loading } = useData();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-navy text-white">
        <div className="flex items-center gap-2 px-4 py-3">
          <span className="text-lg font-extrabold tracking-tight">
            ⚽ WC26 <span className="text-tangerine">Sweepstakes</span>
          </span>
          <nav className="ml-4 hidden gap-1 sm:flex">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-accent text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            {selected && (
              <button
                onClick={clear}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: selected.colour }}
              >
                {selected.name} ✕
              </button>
            )}
            <button
              onClick={() => setDrawerOpen(true)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold md:hidden"
            >
              👥 Players
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2 sm:hidden">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                  isActive ? "bg-accent text-white" : "text-white/70"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <LiveBanner />

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-edge bg-card md:block">
          <ParticipantPanel />
        </aside>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-64 bg-card shadow-xl">
              <ParticipantPanel onSelect={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 p-4">
          {loading && (
            <div className="mb-3 h-1 w-full overflow-hidden rounded-full bg-edge">
              <div className="h-full animate-pulse rounded-full bg-accent" style={{ width: "60%" }} />
            </div>
          )}
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-edge px-4 py-2 text-xs text-soft">
        {lastUpdated ? `Updated ${minsAgo(lastUpdated)}` : "Waiting for data…"}
        {error && " · ⚠ couldn't refresh — showing last known data"}
        <span className="float-right">
          Data: openfootball + ESPN · Family sweepstakes 2026
        </span>
      </footer>

      <GoalFlash />
    </div>
  );
}
