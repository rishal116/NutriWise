"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { logout, setUser } from "@/redux/slices/authSlice";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";

const SKIP_AUTH_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-otp",
  "/reset-password",
];

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const shouldSkip = SKIP_AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

    if (shouldSkip) return;

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const res = await userAuthService.getMe();

        if (!isMounted) return;

        dispatch(setUser(res.data));
      } catch {
        if (!isMounted) return;

        dispatch(logout());
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch, pathname]);

  useEffect(() => {
    if (!user) return;

    const isAuthRoute =
      pathname === "/" ||
      SKIP_AUTH_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      );

    if (!isAuthRoute) return;

    switch (user.activeRole) {
      case "admin":
        router.replace("/admin/dashboard");
        break;

      case "nutritionist":
        router.replace("/nutritionist/dashboard");
        break;

      default:
        router.replace("/");
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
