import { DependencyList, useEffect, useState } from 'react';

/** Carica un dato asincrono dalla sorgente e ne gestisce lo stato. */
export function useData<T>(load: () => Promise<T>, deps: DependencyList = []) {
  const [value, setValue] = useState<T | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    load()
      .then((v) => { if (alive) { setValue(v); setError(undefined); } })
      .catch((e: unknown) => { if (alive) setError(e instanceof Error ? e : new Error(String(e))); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { value, error, loading };
}
