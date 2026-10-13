"use client";

import { useEffect, useState, useCallback } from "react";
import { getAndClearPendingAction, PendingAction } from "@/lib/auth/authGuard";
import { useAppSelector } from "@/redux/hooks";

export function usePendingAction(
  handler?: (action: PendingAction) => void | Promise<void>,
) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const checkPendingAction = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const action = getAndClearPendingAction();
    if (action) {
      setPendingAction(action);
      if (handler) {
        handler(action);
      }
    }
  }, [isAuthenticated, user, handler]);

  useEffect(() => {
    checkPendingAction();
  }, [checkPendingAction]);

  return {
    pendingAction,
    clearPendingAction: () => setPendingAction(null),
  };
}
