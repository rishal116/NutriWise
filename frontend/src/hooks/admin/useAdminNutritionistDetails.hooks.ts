"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { AdminNutritionistDetailsDto } from "@/dtos/admin/nutritionist/admin-nutritionist-details.dto";
import { adminNutritionistService } from "@/services/admin/admin-nutri.service";

interface Result {
  key: string;
  details: AdminNutritionistDetailsDto | null;
  error: string | null;
}

export function useAdminNutritionistDetails(userId: string) {
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Identifies the current request; loading is derived from it, so no
  // synchronous setState happens inside the effect.
  const key = `${userId}:${attempt}`;

  useEffect(() => {
    let cancelled = false;

    adminNutritionistService
      .getNutritionistDetails(userId)
      .then((details) => {
        if (!cancelled) setResult({ key, details: details ?? null, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key,
            details: null,
            error: "Unable to load the nutritionist profile. Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, key]);

  /** Full retry — shows the skeleton again. */
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  /** Silent refetch after a mutation — keeps the page on screen. */
  const refresh = useCallback(async () => {
    try {
      const details = await adminNutritionistService.getNutritionistDetails(userId);
      setResult({ key, details: details ?? null, error: null });
    } catch {
      toast.error("Failed to refresh the profile.");
    }
  }, [userId, key]);

  const current = result && result.key === key ? result : null;

  return {
    details: current?.details ?? null,
    error: current?.error ?? null,
    isLoading: current === null,
    retry,
    refresh,
  };
}