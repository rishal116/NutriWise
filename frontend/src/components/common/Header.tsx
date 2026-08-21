"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Bell,
  LogOut,
  UserCircle,
  Menu,
  X,
  Check,
  ChevronDown,
  Home,
  Flame,
  Stethoscope,
  Users2,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";

import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";
import { RootState } from "@/redux/store";
import Logo from "./Logo";
import { showLoading, hideLoading } from "@/redux/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

type NutritionistCtaKey = "none" | "pending" | "rejected" | "approved";

// Nutritionist row is deliberately minimal — a single line with an icon,
// label, and (when relevant) a small status pill. It should never compete
// visually with the Dashboard card above it; that's the whole point of the
// redesign. Resist the urge to add color/rings/shadows back in here.
const NUTRITIONIST_CTA_CONFIG: Record<
  NutritionistCtaKey,
  {
    icon: typeof Stethoscope;
    title: string;
    pillLabel: string | null;
    pillColor: string;
    pulse: boolean;
  }
> = {
  none: {
    icon: Stethoscope,
    title: "Become a Nutritionist",
    pillLabel: null,
    pillColor: "",
    pulse: false,
  },
  pending: {
    icon: Clock,
    title: "Application under review",
    pillLabel: "Pending",
    pillColor: "text-amber-600",
    pulse: true,
  },
  rejected: {
    icon: AlertCircle,
    title: "Update your application",
    pillLabel: "Needs changes",
    pillColor: "text-rose-600",
    pulse: false,
  },
  approved: {
    icon: Stethoscope,
    title: "Nutritionist Dashboard",
    pillLabel: "Active",
    pillColor: "text-emerald-600",
    pulse: false,
  },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const loading = useSelector((state: RootState) => state.auth.loading);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !accountMenuButtonRef.current?.contains(target)
      ) {
        setOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !mobileMenuButtonRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Header lives in the layout, so it survives client-side navigation —
  // resetting isLoading here too, or the "Get Started" button stays stuck
  // in its spinner state on whatever page /signup lands on.
  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
    setIsLoading(false);
  }, [pathname]);

  const isLoggedIn = !!user;
  const isNutritionist = user?.roles?.includes("nutritionist");
  const isApprovedNutritionist =
    isNutritionist && user?.nutritionistStatus === "approved";

  const activeRole = user?.activeRole ?? "user";

  const nutritionistCtaKey: NutritionistCtaKey =
    user?.nutritionistStatus === "approved"
      ? "approved"
      : user?.nutritionistStatus === "pending"
        ? "pending"
        : user?.nutritionistStatus === "rejected"
          ? "rejected"
          : "none";

  const handleGetStarted = () => {
    setIsLoading(true);
    router.push("/signup");
  };

  const handleLogout = async () => {
    try {
      dispatch(showLoading("Logging out..."));

      await userAuthService.logout();

      dispatch(logout());

      router.replace("/");

      setTimeout(() => {
        dispatch(hideLoading());
      }, 300);
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
    }
  };

  const handleNutritionistDashboard = async () => {
    setOpen(false);
    setMobileOpen(false);

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.nutritionistStatus === null) {
      router.push("/user/nutritionist/application");
      return;
    }

    if (user.nutritionistStatus === "approved") {
      if (user.activeRole !== "nutritionist") {
        await handleSwitchRole("nutritionist");
        return;
      }

      router.push("/nutritionist/dashboard");
      return;
    }

    // pending or rejected
    router.push("/user/nutritionist/application/status");
  };

  const handleSwitchRole = async (role: "user" | "nutritionist") => {
    if (!user || role === activeRole || switching) return;

    setSwitching(true);
    try {
      await userAuthService.switchRole(role);

      dispatch({
        type: "auth/setActiveRole",
        payload: role,
      });

      router.push(
        role === "nutritionist" ? "/nutritionist/dashboard" : "/user/dashboard",
      );
    } finally {
      setSwitching(false);
    }
  };

  const getUserInitial = () => {
    if (user?.fullName) return user.fullName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Challenges", href: "/challenges", icon: Flame },
    { name: "Nutritionists", href: "/coaching", icon: Stethoscope },
    { name: "Communities", href: "/communities", icon: Users2 },
  ];

  // Dashboard is the one thing every logged-in user needs on every visit —
  // it gets the only richly-styled treatment in the menu.
  const DashboardCard = ({ mobile = false }: { mobile?: boolean }) => (
    <Link
      href="/user/dashboard"
      onClick={() => (mobile ? setMobileOpen(false) : setOpen(false))}
      className={`group flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 transition-colors hover:bg-emerald-50 ${
        mobile ? "active:scale-[0.98]" : ""
      }`}
    >
      <span className="shrink-0 w-10 h-10 rounded-xl bg-white ring-1 ring-emerald-100 flex items-center justify-center">
        <UserCircle className="w-5 h-5 text-emerald-600" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-slate-900">
          Dashboard
        </span>
        <span className="block text-xs text-slate-500 mt-0.5">
          Your progress, plans & activity
        </span>
      </span>
      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );

  // Deliberately quiet — a single row, not a card. See config comment above.
  const NutritionistRow = ({ mobile = false }: { mobile?: boolean }) => {
    const cfg = NUTRITIONIST_CTA_CONFIG[nutritionistCtaKey];
    const Icon = cfg.icon;

    return (
      <button
        onClick={handleNutritionistDashboard}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 transition-colors ${
          mobile ? "active:scale-[0.98]" : ""
        }`}
      >
        <span className="relative shrink-0 w-5 h-5 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-400" />
          {cfg.pulse && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </span>
        <span className="flex-1 text-sm text-slate-600">{cfg.title}</span>
        {cfg.pillLabel && (
          <span
            className={`shrink-0 text-[10px] font-semibold ${cfg.pillColor}`}
          >
            {cfg.pillLabel}
          </span>
        )}
      </button>
    );
  };

  const RoleSwitcher = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "mt-3" : "mt-3"}>
      <p className="text-[11px] font-semibold text-emerald-700/70 uppercase tracking-wide mb-1.5 px-0.5">
        Viewing as
      </p>
      <div className="flex items-center bg-white border border-emerald-100 rounded-xl p-1 gap-1">
        {(["user", "nutritionist"] as const).map((role) => (
          <button
            key={role}
            onClick={() => handleSwitchRole(role)}
            disabled={switching}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              activeRole === role
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {activeRole === role && <Check className="w-3 h-3" />}
            {role === "user" ? "User" : "Nutritionist"}
          </button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="w-32 h-8 bg-slate-100 rounded-xl animate-pulse" />
          <div className="hidden lg:flex items-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-8 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm shadow-emerald-900/[0.03]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo size="default" href="/" />

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute left-4 right-4 -bottom-[1px] h-0.5 bg-emerald-600 rounded-full transition-transform origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                aria-label="Notifications"
                title="Notifications"
                className="p-2 rounded-xl hover:bg-slate-50 transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              </button>
            )}

            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  ref={accountMenuButtonRef}
                  onClick={() => setOpen(!open)}
                  aria-expanded={open}
                  aria-label="Account menu"
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <span className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm shrink-0">
                    {getUserInitial()}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform hidden md:block ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-emerald-900/10 z-50 overflow-hidden origin-top-right transition-all duration-150 ease-out ${
                    open
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-4 bg-emerald-50/60 border-b border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getUserInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {isNutritionist && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-emerald-600 rounded-full text-xs font-semibold text-white mt-3">
                        Nutritionist
                      </div>
                    )}

                    {isApprovedNutritionist && <RoleSwitcher />}
                  </div>

                  {/* Dashboard — the primary, common action */}
                  <div className="px-3 pt-3 pb-1.5">
                    <DashboardCard />
                  </div>

                  {/* Nutritionist — secondary, single line */}
                  <div className="px-3 pb-2">
                    <NutritionistRow />
                  </div>

                  <div className="border-t border-slate-100 py-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600 disabled:opacity-80 text-white rounded-xl shadow-sm shadow-emerald-900/10 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Loading..
                    </>
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

            <button
              ref={mobileMenuButtonRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        <div
          ref={mobileMenuRef}
          className={`lg:hidden border-t border-slate-100 bg-white overflow-hidden transition-all duration-200 ease-out ${
            mobileOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0 border-t-0"
          }`}
        >
          <div className="py-3 space-y-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`}
                  />
                  {link.name}
                </Link>
              );
            })}

            {isLoggedIn ? (
              <div className="pt-3 mt-2 border-t border-slate-100 space-y-0.5">
                <div className="px-4 py-3 bg-emerald-50/60 rounded-xl mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {getUserInitial()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {isNutritionist && (
                    <div className="inline-flex items-center px-2.5 py-1 bg-emerald-600 rounded-full text-xs font-semibold text-white mt-2">
                      Nutritionist
                    </div>
                  )}

                  {isApprovedNutritionist && <RoleSwitcher mobile />}
                </div>

                {/* Dashboard — the primary, common action */}
                <div className="px-1">
                  <DashboardCard mobile />
                </div>

                {/* Nutritionist — secondary, single line */}
                <div className="px-1 mt-1">
                  <NutritionistRow mobile />
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2 px-1">
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
