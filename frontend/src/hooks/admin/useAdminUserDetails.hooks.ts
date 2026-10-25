"use client";

import { useCallback, useEffect, useState } from "react";

import type { AdminUserDetailsDto } from "@/dtos/admin/user/admin-user-details.dto";
import { adminUserService } from "@/services/admin/admin-user.service";

interface Result {
  key: string;
  user: AdminUserDetailsDto | null;
  error: string | null;
}

export function useAdminUserDetails(userId: string) {
  const [result, setResult] = useState<Result | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Identifies the current request; loading is derived from it, so no
  // synchronous setState is needed inside the effect.
  const key = `${userId}:${attempt}`;

  useEffect(() => {
    let cancelled = false;

    adminUserService
      .getUserDetails(userId)
      .then((response) => {
        if (!cancelled) {
          setResult({ key, user: response.data ?? null, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key,
            user: null,
            error: "Unable to load user details. Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, key]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const isLoading = result?.key !== key;

  return {
    user: isLoading ? null : result.user,
    error: isLoading ? null : result.error,
    isLoading,
    retry,
  };
}
