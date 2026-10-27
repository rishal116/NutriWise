"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { logout, setAccessToken, setUser } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { isAuthPage } from "@/lib/auth/authGuard";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { refreshAccessToken } from "@/lib/axios/clientApi";

const SKIP_AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

const ACTIVE_ROLE_COOKIE = "nutriwise_active_role";

function syncActiveRoleCookie(activeRole: string | undefined) {
  if (typeof document === "undefined") return;

  if (
    activeRole === "nutritionist" ||
    activeRole === "admin" ||
    activeRole === "user"
  ) {
    document.cookie = `${ACTIVE_ROLE_COOKIE}=${encodeURIComponent(
      activeRole,
    )}; Path=/; SameSite=Lax`;
  } else {
    document.cookie = `${ACTIVE_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const user = useSelector((state: RootState) => state.auth.user);
  const initialized = useSelector((state: RootState) => state.auth.initialized);

  useEffect(() => {
    if (initialized) return;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        let accessToken = tokenStorage.get();

        if (accessToken) {
          dispatch(setAccessToken(accessToken));

          try {
            const response = await userAuthService.getMe();

            if (!isMounted) return;

            if (!response.data) {
              throw new Error("User data was not returned.");
            }

            syncActiveRoleCookie(response.data.activeRole);
            dispatch(setUser(response.data));
            return;
          } catch {
            if (!isMounted) return;

            // The stored token may be expired. Try refreshing below.
          }
        }

        accessToken = await refreshAccessToken();

        if (!isMounted) return;

        dispatch(setAccessToken(accessToken));

        const response = await userAuthService.getMe();

        if (!isMounted) return;

        if (!response.data) {
          throw new Error("User data was not returned.");
        }

        syncActiveRoleCookie(response.data.activeRole);
        dispatch(setUser(response.data));
      } catch {
        if (!isMounted) return;

        tokenStorage.remove();
        syncActiveRoleCookie(undefined);
        dispatch(logout());
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, initialized]);

  useEffect(() => {
    if (!initialized || !user) return;

    const isAuthRoute = SKIP_AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (pathname !== "/" && !isAuthRoute) return;

    const redirectParam = searchParams.get("redirect");

    if (
      isAuthRoute &&
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !isAuthPage(redirectParam)
    ) {
      router.replace(redirectParam);
      return;
    }

    switch (user.activeRole) {
      case "admin":
        router.replace("/admin/dashboard");
        break;

      case "nutritionist":
        router.replace("/nutritionist/dashboard");
        break;

      case "user":
      default:
        router.replace("/");
        break;
    }
  }, [initialized, user, pathname, router, searchParams]);

  const shouldHideHome =
    pathname === "/" &&
    (!initialized ||
      user?.activeRole === "nutritionist" ||
      user?.activeRole === "admin");

  const shouldWaitForDashboard =
    pathname === "/nutritionist/dashboard" && !initialized;

  if (shouldHideHome || shouldWaitForDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div
          role="status"
          aria-label="Loading your account"
          className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"
        />
      </div>
    );
  }

  return <>{children}</>;
}
