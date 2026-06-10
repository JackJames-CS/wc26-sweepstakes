import { useEffect, useState } from "react";
import type { SquadPlayer } from "../types";

type SquadsFile = {
  generated: string;
  squads: Record<string, SquadPlayer[]>;
};

// squads.json is 200+ KB, so it's fetched on demand rather than bundled,
// and cached at module level for the rest of the session.
let cache: SquadsFile | null = null;
let pending: Promise<SquadsFile> | null = null;

function load(): Promise<SquadsFile> {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch(`${import.meta.env.BASE_URL}squads.json`)
    .then((r) => {
      if (!r.ok) throw new Error(`squads fetch failed: ${r.status}`);
      return r.json() as Promise<SquadsFile>;
    })
    .then((d) => (cache = d));
  return pending;
}

export function useSquads() {
  const [data, setData] = useState<SquadsFile | null>(cache);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    load()
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  return { squads: data?.squads ?? null, generated: data?.generated, error };
}
