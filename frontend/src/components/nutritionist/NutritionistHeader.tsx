"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Check } from "lucide-react";

import { userAuthService } from "@/services/user/userAuth.service";
import { setAccessToken, setActiveRole } from "@/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import NotificationBell from "@/components/notification/NotificationBell";
import Logo from "../common/Logo";
import { clearAuthSession } from "@/lib/auth/clearAuthSession";

type Role = "user" | "nutritionist";

const ROLE_COOKIE = "nutriwise_active_role";
const ROLES: { value: Role; label: string }[] = [
  { value: "nutritionist", label: "Nutritionist" },
  { value: "user", label: "User" },
];

const HEADER_CLASS =
  "sticky top-0 z-50 h-16 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm";
const CONTAINER_CLASS =
  "mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8";

export default function NutritionistHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((s) => s.auth.user);
  const initialized = useAppSelector((s) => s.auth.initialized);

  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const activeRole = user?.activeRole ?? "user";
  const isApprovedNutritionist =
    !!user?.roles.includes("nutritionist") &&
    user.nutritionistStatus === "approved";
  const canSwitchToUser = !!user?.roles.includes("user");

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    if (!initialized) return;
    if (!user) router.replace("/login");
    else if (!isApprovedNutritionist) router.replace("/user/dashboard");
  }, [initialized, user, isApprovedNutritionist, router]);

  const handleSwitchRole = async (role: Role) => {
    if (!user || switching || role === activeRole) return;

    if (role === "nutritionist" && !isApprovedNutritionist) {
      router.replace("/user/dashboard");
      return;
    }

    setSwitching(true);
    closeMenu();

    try {
      const res = await userAuthService.switchRole(role);
      const token = res.data?.accessToken;
      if (!res.success || !token) throw new Error("Role switching failed.");

      tokenStorage.set(token);
      dispatch(setAccessToken(token));
      dispatch(setActiveRole(role));

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${ROLE_COOKIE}=${role}; Path=/; SameSite=Lax${secure}`;

      window.location.assign(
        role === "nutritionist" ? "/nutritionist/dashboard" : "/user/dashboard",
      );
    } catch (err) {
      console.error("Failed to switch role:", err);
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await userAuthService.logout();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      clearAuthSession();
      router.replace("/login");
    }
  };

  if (!initialized) {
    return (
      <header className={HEADER_CLASS}>
        <div className={CONTAINER_CLASS}>
          <div className="h-8 w-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </header>
    );
  }

  if (!user) return null;

  return (
    <header className={HEADER_CLASS}>
      <div className={CONTAINER_CLASS}>
        <Logo href="/nutritionist/dashboard" />

        <div className="flex items-center gap-2">
          <NotificationBell notificationsHref="/nutritionist/notifications" />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2.5 rounded-full border border-transparent p-1 transition-colors hover:border-slate-200/80 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:pr-3"
            >
              <div className="hidden min-w-0 text-right lg:block">
                <p className="max-w-[10rem] truncate text-xs font-semibold text-slate-900">
                  {user.fullName ? `Dr. ${user.fullName}` : "Nutritionist"}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                  Expert
                </p>
              </div>

              <div className="relative h-9 w-9 shrink-0">
                <Image
                  src={user.profileImage || "/images/images.jpg"}
                  fill
                  sizes="36px"
                  className="rounded-full border-2 border-white object-cover"
                  alt="Profile"
                  unoptimized
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg">
                <div className="border-b border-slate-100 bg-emerald-50/40 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                {canSwitchToUser && (
                  <div className="px-3 pb-1.5 pt-3">
                    <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700/70">
                      Viewing as
                    </p>
                    <div className="flex gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1">
                      {ROLES.map(({ value, label }) => {
                        const active = activeRole === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleSwitchRole(value)}
                            disabled={switching}
                            aria-pressed={active}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                              active
                                ? "bg-emerald-700 text-white"
                                : "text-slate-500 hover:bg-white hover:text-slate-800"
                            }`}
                          >
                            {active && <Check className="h-3 w-3" />}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50 focus-visible:outline-none focus-visible:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
