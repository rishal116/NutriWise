"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  redirectToLogin,
  savePendingAction,
  isAuthPage,
} from "@/lib/auth/authGuard";

export interface GuardActionOptions {
  redirectUrl?: string;
  actionKey?: string;
  actionPayload?: unknown;
}

export function useAuthGuard() {
  const pathname = usePathname();

  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth,
  );

  const requireAuth = useCallback(
    (customRedirectUrl?: string): boolean => {
      if (isAuthenticated && user) {
        return true;
      }

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        const targetUrl =
          customRedirectUrl || currentPath + window.location.search;

        if (!isAuthPage(currentPath)) {
          redirectToLogin(targetUrl);
        }
      }

      return false;
    },
    [isAuthenticated, user],
  );

  const guardAction = useCallback(
    async <T>(
      actionFn: () => Promise<T> | T,
      options?: GuardActionOptions,
    ): Promise<T | undefined> => {
      if (isAuthenticated && user) {
        return actionFn();
      }

      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : pathname;

      const targetUrl =
        options?.redirectUrl ||
        (typeof window !== "undefined"
          ? currentPath + window.location.search
          : pathname);

      if (options?.actionKey) {
        savePendingAction(options.actionKey, options.actionPayload, targetUrl);
      }

      if (typeof window !== "undefined" && !isAuthPage(currentPath)) {
        redirectToLogin(targetUrl);
      }

      return undefined;
    },
    [isAuthenticated, user, pathname],
  );

  return {
    isAuthenticated,
    user,
    loading,
    requireAuth,
    guardAction,
    redirectToLogin,
  };
}
