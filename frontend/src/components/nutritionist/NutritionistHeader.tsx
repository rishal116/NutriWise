"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, CheckCircle2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { userAuthService } from "@/services/user/userAuth.service";
import { logout, setAccessToken, setUser } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import Logo from "../common/Logo";

export default function NutritionistHeader() {
  const dispatch = useDispatch();
  const router = useRouter();

  const user = useSelector((state: RootState) => state.auth.user);
  const initialized = useSelector((state: RootState) => state.auth.initialized);

  const [switching, setSwitching] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSwitchRole = async (role: "user" | "nutritionist") => {
    if (!user || role === user.activeRole || switching) {
      return;
    }

    setSwitching(true);

    try {
      const response = await userAuthService.switchRole(role);

      if (response.accessToken) {
        dispatch(setAccessToken(response.accessToken));
      }

      dispatch(
        setUser({
          ...user,
          activeRole: role,
        }),
      );

      router.push(
        role === "user" ? "/user/dashboard" : "/nutritionist/dashboard",
      );
    } catch {
      // Keep the current role and user state if switching fails.
    } finally {
      setSwitching(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await userAuthService.logout();
    } finally {
      dispatch(logout());
      router.replace("/login");
      setLoggingOut(false);
    }
  };

  const canSwitchToUser = user?.roles.includes("user");

  if (!initialized) {
    return (
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </header>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo href="/nutritionist/dashboard" />

        <div className="flex items-center gap-2">
          <div className="sm:relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((open) => !open)}
              aria-label="Notifications"
              aria-haspopup="true"
              aria-expanded={notifOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
                notifOpen
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
              }`}
            >
              <Bell className="h-5 w-5" />
            </button>

            {notifOpen && (
              <div className="absolute inset-x-4 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg sm:inset-x-auto sm:right-0 sm:w-96">
                <div className="border-b border-emerald-100 bg-emerald-50/40 px-4 py-3">
                  <h3 className="text-sm font-bold tracking-tight text-emerald-900">
                    Notifications
                  </h3>
                </div>
                <div className="px-4 py-10 text-center">
                  <CheckCircle2
                    className="mx-auto mb-3 text-emerald-200"
                    size={36}
                  />
                  <p className="text-sm font-medium text-slate-500">
                    All caught up!
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Account menu"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              className="flex items-center gap-2.5 rounded-full border border-transparent p-1 transition-colors duration-150 hover:border-slate-200/80 hover:bg-slate-50 lg:pr-3"
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
                  className="rounded-full border-2 border-white object-cover shadow-xs"
                  alt="Profile"
                  unoptimized
                />
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg">
                <div className="border-b border-slate-100 bg-emerald-50/40 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.fullName}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                    {user.email}
                  </p>
                </div>

                {canSwitchToUser && (
                  <div className="px-3 pb-1.5 pt-3">
                    <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700/70">
                      Viewing as
                    </p>
                    <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-1">
                      {(["nutritionist", "user"] as const).map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleSwitchRole(role)}
                          disabled={switching}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50 ${
                            user.activeRole === role
                              ? "bg-emerald-700 text-white shadow-xs"
                              : "text-slate-500 hover:bg-white hover:text-slate-800"
                          }`}
                        >
                          {user.activeRole === role && (
                            <Check className="h-3 w-3" />
                          )}
                          {role === "user" ? "User" : "Nutritionist"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-1.5">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-50"
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
