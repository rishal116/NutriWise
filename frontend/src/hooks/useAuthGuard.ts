"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import {
  redirectToLogin,
  savePendingAction,
  isAuthPage,
} from "@/lib/auth/authGuard";

export interface GuardActionOptions {
  redirectUrl?: string;
  actionKey?: string;
  actionPayload?: any;
}

export function useAuthGuard() {
  const router = useRouter();
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
        const targetUrl =
          customRedirectUrl || window.location.pathname + window.location.search;

        if (!isAuthPage(window.location.pathname)) {
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
        return await actionFn();
      }

      const targetUrl =
        options?.redirectUrl ||
        (typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : pathname);

      if (options?.actionKey) {
        savePendingAction(options.actionKey, options.actionPayload, targetUrl);
      }

      if (typeof window !== "undefined" && !isAuthPage(window.location.pathname)) {
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
