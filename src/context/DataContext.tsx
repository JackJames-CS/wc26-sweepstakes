import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { EspnEvent, OFMatch, StandingRow, TeamStatus, WCMatch } from "../types";
import { fetchOpenfootball, toWCMatches } from "../lib/parse";
import { fetchEspnScoreboard, mergeEspn } from "../lib/espn";
import { computeStandings } from "../lib/standings";
import { computeTeamStatuses } from "../lib/status";
import { computeGoldenBoot, type Scorer } from "../lib/goldenboot";

const OF_INTERVAL = 5 * 60 * 1000; // full schedule — updated upstream ~daily
const ESPN_INTERVAL = 60 * 1000; // live scores on matchdays

type DataContextValue = {
  matches: WCMatch[];
  standings: Map<string, StandingRow[]>;
  statuses: Map<string, TeamStatus>;
  goldenBoot: Scorer[];
  loading: boolean;
  error: boolean;
  lastUpdated: Date | null;
};

const Ctx = createContext<DataContextValue>({
  matches: [],
  standings: new Map(),
  statuses: new Map(),
  goldenBoot: [],
  loading: true,
  error: false,
  lastUpdated: null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<OFMatch[] | null>(null);
  const [espn, setEspn] = useState<EspnEvent[]>([]);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const matches = await fetchOpenfootball();
        if (cancelled) return;
        setRaw(matches);
        setError(false);
        setLastUpdated(new Date());
      } catch {
        if (!cancelled) setError(true);
      }
    };
    load();
    const id = setInterval(load, OF_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const events = await fetchEspnScoreboard();
        if (!cancelled) setEspn(events);
      } catch {
        /* ESPN is best-effort — openfootball remains the fallback */
      }
      if (!cancelled) setTick((t) => t + 1);
    };
    load();
    const id = setInterval(load, ESPN_INTERVAL);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const matches = useMemo(() => {
    void tick; // recompute live windows each poll even if fetches fail
    if (!raw) return [];
    return mergeEspn(toWCMatches(raw), espn);
  }, [raw, espn, tick]);

  const standings = useMemo(() => computeStandings(matches), [matches]);
  const statuses = useMemo(
    () => computeTeamStatuses(matches, standings),
    [matches, standings],
  );
  const goldenBoot = useMemo(() => computeGoldenBoot(matches), [matches]);

  const value: DataContextValue = {
    matches,
    standings,
    statuses,
    goldenBoot,
    loading: raw === null && !error,
    error,
    lastUpdated,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData() {
  return useContext(Ctx);
}
