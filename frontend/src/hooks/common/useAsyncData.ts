"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";

// `fetcher` must be referentially stable (module-level function or useCallback).
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (requestId === requestIdRef.current) setData(result);
    } catch (err: unknown) {
      if (requestId === requestIdRef.current) setError(getErrorMessage(err));
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    void load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [load]);

  return { data, loading, error, reload: load };
}
