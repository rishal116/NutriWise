"use client";

import { ReactNode, useEffect } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";

import { logout, setUser } from "@/redux/slices/authSlice";

import { RootState } from "@/redux/store";

import { userAuthService } from "@/services/user/userAuth.service";

import { isAuthPage } from "@/lib/auth/authGuard";

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
    if (initialized) {
      return;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const response = await userAuthService.getMe();

        if (!isMounted) {
          return;
        }

        dispatch(setUser(response.data));
      } catch {
        if (!isMounted) {
          return;
        }

        dispatch(logout());
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, initialized]);

  useEffect(() => {
    if (!initialized || !user) {
      return;
    }

    const isAuthRoute = SKIP_AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    const isPublicHomeRoute = pathname === "/";

    if (!isAuthRoute && !isPublicHomeRoute) {
      return;
    }

    const redirectParam = searchParams.get("redirect");

    if (
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
        router.replace("/user/dashboard");
        break;
    }
  }, [initialized, user, pathname, router, searchParams]);

  return <>{children}</>;
}
