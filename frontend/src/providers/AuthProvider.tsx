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
        const storedToken = tokenStorage.get();

        if (storedToken) {
          dispatch(setAccessToken(storedToken));

          try {
            const response = await userAuthService.getMe();

            if (!isMounted) return;

            if (!response.data) {
              throw new Error("User data was not returned.");
            }

            dispatch(setUser(response.data));
            return;
          } catch {
            if (!isMounted) return;
          }
        }

        if (isAuthPage(pathname) && !storedToken) {
          if (isMounted) {
            dispatch(logout());
          }
          return;
        }

        const accessToken = await refreshAccessToken();

        if (!isMounted) return;

        dispatch(setAccessToken(accessToken));

        const response = await userAuthService.getMe();

        if (!isMounted) return;

        if (!response.data) {
          throw new Error("User data was not returned.");
        }

        dispatch(setUser(response.data));
      } catch {
        if (isMounted) {
          dispatch(logout());
        }
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, initialized, pathname]);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    const isAuthRoute = SKIP_AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (pathname !== "/" && !isAuthRoute) {
      return;
    }

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

  return <>{children}</>;
}
