"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/layout/Logo";


import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Shield,
  Sparkles,
  UserCircle,
  Users,
  X,
  Home,
  Flame,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { logout, setToken } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "client" | "nutritionist" | "admin";

interface User {
  id: string;
  email: string;
  fullName: string;
  roles: Role[];
  activeRole: Role;
  isBlocked: boolean;
  profileImageUrl?: string;
  nutritionistStatus?: "pending" | "approved" | "rejected" | "none";
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const navLinks = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Challenges", href: "/challenges", icon: Flame },
  { name: "Nutritionists", href: "/coaching", icon: Sparkles },
  { name: "Communities", href: "/communities", icon: Users },
];

// ─── Role meta ────────────────────────────────────────────────────────────────

const ROLE_META: Record<
  Role,
  { label: string; gradient: string; ring: string; dot: string; desc: string }
> = {
  client: {
    label: "Client",
    gradient: "from-emerald-500 to-teal-600",
    ring: "ring-emerald-200",
    dot: "bg-emerald-400",
    desc: "Personal health journey",
  },
  nutritionist: {
    label: "Nutritionist",
    gradient: "from-violet-500 to-purple-600",
    ring: "ring-violet-200",
    dot: "bg-violet-400",
    desc: "Manage your clients",
  },
  admin: {
    label: "Admin",
    gradient: "from-rose-500 to-orange-500",
    ring: "ring-rose-200",
    dot: "bg-rose-400",
    desc: "Platform management",
  },
};

const ROLE_ICON: Record<Role, React.ReactNode> = {
  client: <Users className="h-4 w-4" />,
  nutritionist: <Settings className="h-4 w-4" />,
  admin: <Shield className="h-4 w-4" />,
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifPulse, setNotifPulse] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);

  // ── Nav loading indicator ────────────────────────────────────────────────────

  const handleNavClick = (href: string) => {
    if (pathname !== href) setIsNavigating(true);
  };

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // ── Fetch user ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userAuthService.getMe();
        console.log(res);

        setUser(res.success ? res.user : null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ── Scroll show/hide ─────────────────────────────────────────────────────────

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      setScrolled(cur > 20);
      if (cur <= 10) setVisible(true);
      else if (cur > last && cur > 100) setVisible(false);
      else if (cur < last) setVisible(true);
      last = cur;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Outside click for dropdown ───────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Close mobile on route change ─────────────────────────────────────────────

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Lock body scroll when mobile open ───────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      localStorage.removeItem("token");
      dispatch(logout());
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getNutritionistButtonLabel = () => {
    if (!user) return "Become a Coach";

    switch (user.nutritionistStatus) {
      case "pending":
        return "Application Pending";
      case "approved":
        return "Go to Nutritionist Dashboard";
      case "rejected":
        return "Reapply as Nutritionist";
      default:
        return "Become a Coach";
    }
  };

  const getNutritionistSubText = () => {
    if (!user) return "Start your nutrition journey";

    switch (user.nutritionistStatus) {
      case "pending":
        return "Waiting for admin approval";
      case "approved":
        return "Access your nutritionist dashboard";
      case "rejected":
        return "Update your details and reapply";
      default:
        return "Apply as a nutritionist";
    }
  };

  {/* ── SWITCH ROLE API HANDLER ───────────────────────────────────────────── */}
const handleSwitchRole = async (role: Role) => {
  if (!user || user.activeRole === role) return;

  try {
    setIsNavigating(true);

    // ✅ Backend call to update active role + refresh tokens
    const res = await userAuthService.switchRole(role);

    if (res.success) {
      // ✅ Update Redux token
      if (res.accessToken) {
        dispatch(setToken(res.accessToken));
      }

      // ✅ Update local user state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              activeRole: role,
            }
          : prev
      );

      setOpen(false);
      setMobileOpen(false);

      // ✅ Redirect based on role
      switch (role) {
        case "client":
          router.push("/home");
          break;

        case "nutritionist":
          router.push("/nutritionist/dashboard");
          break;

        case "admin":
          router.push("/admin");
          break;

        default:
          router.push("/home");
      }
    }
  } catch (error) {
    console.error("Role switch failed:", error);
  } finally {
    setIsNavigating(false);
  }
};

  const handleBecomeNutritionist = () => {
    if (!user) return;

    setOpen(false);

    // IMPORTANT: this is NOT role switching, it's application flow
    switch (user.nutritionistStatus) {
      case "approved":
        router.push("/nutritionist/dashboard");
        break;

      case "pending":
        router.push("/nutritionist/pending");
        break;

      case "rejected":
        router.push("/nutritionist/reapply");
        break;

      default:
        router.push("/nutritionist/details");
        break;
    }
  };
  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getUserInitial = () =>
    user?.fullName?.charAt(0).toUpperCase() ??
    user?.email?.charAt(0).toUpperCase() ??
    "U";

  const isLoggedIn = Boolean(user);
  const canSwitchRole =
    user && Array.isArray(user.roles) && user.roles.length > 1;
  const canApplyNutritionist = user && !user.roles.includes("nutritionist");
  const activeRole = user?.activeRole ?? "client";
  const activeMeta = ROLE_META[activeRole];

  // ── Loading skeleton ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <header className="fixed top-0 z-50 w-full">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="h-8 w-36 animate-pulse rounded-xl bg-emerald-100/80" />
          <div className="flex gap-2">
            {[72, 56, 72, 56].map((w, i) => (
              <div
                key={i}
                className={`h-8 w-${w === 72 ? "18" : "14"} animate-pulse rounded-xl bg-gray-100`}
                style={{ width: w }}
              />
            ))}
          </div>
          <div className="h-9 w-9 animate-pulse rounded-full bg-emerald-100/80" />
        </div>
      </header>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className={[
          "fixed left-0 right-0 top-0 z-50 transition-[background,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-emerald-100/60 bg-white/80 shadow-[0_4px_32px_-4px_rgba(16,185,129,0.1)] backdrop-blur-2xl"
            : "bg-transparent",
        ].join(" ")}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO — untouched per instruction */}
            <div
              onClick={() => {
                handleNavClick("/home");
                router.push("/home");
              }}
              className="group flex cursor-pointer items-center gap-2.5"
            >
              <Logo onClick={() => router.push("/home")} />

              <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-xl font-black text-transparent">
                NutriWise
              </span>
            </div>

            {/* DESKTOP NAV — pill tray with sliding indicator */}
            <div className="hidden lg:flex items-center">
              <div className="relative flex items-center gap-0.5 rounded-2xl bg-white/60 px-1.5 py-1.5 ring-1 ring-black/[0.06] backdrop-blur-sm">
                {navLinks.map(({ name, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => handleNavClick(href)}
                      className="relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors duration-150"
                    >
                      {/* Sliding pill bg */}
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-300/30"
                          transition={{
                            type: "spring",
                            bounce: 0.18,
                            duration: 0.4,
                          }}
                        />
                      )}
                      <Icon
                        className={[
                          "relative z-10 h-[15px] w-[15px] transition-colors",
                          active ? "text-white" : "text-gray-400",
                        ].join(" ")}
                      />
                      <span
                        className={[
                          "relative z-10 transition-colors",
                          active
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-900",
                        ].join(" ")}
                      >
                        {name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center gap-2">
              {/* Navigation loading spinner */}
              <AnimatePresence>
                {isNavigating && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Notification bell */}
              {isLoggedIn && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setNotifPulse(false)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/[0.06] backdrop-blur-sm transition-all hover:bg-emerald-50 hover:ring-emerald-200"
                >
                  <Bell className="h-[17px] w-[17px] text-gray-500 transition-colors hover:text-emerald-600" />
                  {notifPulse && (
                    <>
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-ping rounded-full bg-emerald-400/80" />
                    </>
                  )}
                </motion.button>
              )}

              {/* User dropdown trigger */}
              {isLoggedIn && user ? (
                <div ref={dropdownRef} className="relative hidden sm:block">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpen((p) => !p)}
                    className={[
                      "flex items-center gap-2.5 rounded-2xl px-2 py-1.5 ring-1 transition-all duration-200",
                      open
                        ? "bg-emerald-50 ring-emerald-300 shadow-lg shadow-emerald-100"
                        : "bg-white/80 ring-black/[0.06] hover:ring-emerald-200 hover:bg-white backdrop-blur-sm",
                    ].join(" ")}
                  >
                    {/* Avatar with role-colored dot */}
                    <div className="relative">
                      <div
                        className={[
                          "flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                          activeMeta.gradient,
                        ].join(" ")}
                      >
                        {getUserInitial()}
                      </div>
                      <span
                        className={[
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white",
                          activeMeta.dot,
                        ].join(" ")}
                      />
                    </div>

                    <div className="hidden flex-col items-start md:flex">
                      <span className="max-w-[88px] truncate text-xs font-bold text-gray-800 leading-tight">
                        {user.fullName.split(" ")[0]}
                      </span>
                      <span className="text-[10px] font-medium text-gray-400 leading-tight capitalize">
                        {activeMeta.label}
                      </span>
                    </div>

                    <ChevronDown
                      className={[
                        "h-3.5 w-3.5 text-gray-400 transition-transform duration-200",
                        open ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </motion.button>

                  {/* ── DROPDOWN ──────────────────────────────────────────── */}
                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -8 }}
                        transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute right-0 mt-2.5 w-[300px] origin-top-right overflow-hidden rounded-[1.5rem] border border-gray-100/80 bg-white shadow-[0_20px_60px_-8px_rgba(0,0,0,0.15)]"
                      >
                        {/* Profile header */}
                        <div className="relative overflow-hidden px-5 pt-5 pb-4">
                          <div
                            className={[
                              "absolute inset-0 bg-gradient-to-br opacity-[0.07]",
                              activeMeta.gradient,
                            ].join(" ")}
                          />
                          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-emerald-400/10" />

                          <div className="relative flex items-center gap-3.5">
                            {/* Large avatar */}
                            <div className="relative shrink-0">
                              <div
                                className={[
                                  "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-xl font-black text-white shadow-lg",
                                  activeMeta.gradient,
                                ].join(" ")}
                              >
                                {getUserInitial()}
                              </div>
                              <span
                                className={[
                                  "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm",
                                  activeMeta.dot,
                                ].join(" ")}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[15px] font-bold text-gray-900 leading-tight">
                                {user.fullName}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-gray-500">
                                {user.email}
                              </p>
                              <span
                                className={[
                                  "mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
                                  activeMeta.gradient,
                                ].join(" ")}
                              >
                                {ROLE_ICON[activeRole]}
                                {activeMeta.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="mx-4 h-px bg-gray-100" />

                        {/* Menu items */}
                        <div className="p-2 space-y-0.5">
                          <DropdownLink
                            href="/client/profile"
                            icon={<UserCircle className="h-4 w-4" />}
                            label="My Profile"
                            sub="View & edit your details"
                            onClick={() => setOpen(false)}
                          />

                          {canApplyNutritionist && (
                            <DropdownButton
                              icon={<Sparkles className="h-4 w-4" />}
                              label={getNutritionistButtonLabel()}
                              sub={getNutritionistSubText()}
                              accent
                              onClick={handleBecomeNutritionist}
                            />
                          )}
                        </div>

                        {/* Switch workspace */}
                        {canSwitchRole && (
                          <>
                            <div className="mx-4 h-px bg-gray-100" />
                            <div className="p-3">
                              <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                Switch Workspace
                              </p>
                              <div className="space-y-1">
                                {user.roles.map((role) => {
                                  const meta = ROLE_META[role];
                                  const active = user.activeRole === role;
                                  return (
                                    <button
                                      key={role}
                                      type="button"
                                      onClick={() => handleSwitchRole(role)}
                                      className={[
                                        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150",
                                        active
                                          ? "bg-gray-50 ring-1 ring-gray-100"
                                          : "hover:bg-gray-50",
                                      ].join(" ")}
                                    >
                                      <div
                                        className={[
                                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform group-hover:scale-105",
                                          active
                                            ? meta.gradient
                                            : "from-gray-200 to-gray-300",
                                        ].join(" ")}
                                      >
                                        {ROLE_ICON[role]}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800">
                                          {meta.label}
                                        </p>
                                        <p className="text-xs text-gray-400 truncate">
                                          {meta.desc}
                                        </p>
                                      </div>
                                      {active ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                      ) : (
                                        <ArrowRight className="h-4 w-4 text-gray-300 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        )}

                        {/* Logout */}
                        <div className="p-2 pt-0">
                          <div className="mx-2 mb-2 h-px bg-gray-100" />
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all hover:bg-red-50"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100">
                              <LogOut className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-red-600">
                                Sign out
                              </p>
                              <p className="text-xs text-red-400/80">
                                End your current session
                              </p>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : !isLoggedIn ? (
                <Link
                  href="/login"
                  className="hidden items-center gap-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200/60 transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-300/60 sm:flex"
                >
                  Get started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}

              {/* Mobile hamburger */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileOpen((p) => !p)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 ring-1 ring-black/[0.06] backdrop-blur-sm transition-all hover:bg-emerald-50 hover:ring-emerald-200 lg:hidden"
              >
                {mobileOpen ? (
                  <X className="h-[18px] w-[18px] text-gray-700" />
                ) : (
                  <Menu className="h-[18px] w-[18px] text-gray-700" />
                )}
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Page spacer */}
      <div className="h-16" />

      {/* ── MOBILE SHEET ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] lg:hidden"
            />

            {/* Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 z-40 flex h-full w-[300px] max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
            >
              {/* Sheet top bar */}
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-100 px-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍃</span>
                  <span className="text-sm font-bold text-gray-700">
                    NutriWise
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              {/* User card */}
              {isLoggedIn && user && (
                <div className="m-4 shrink-0 overflow-hidden rounded-2xl">
                  <div
                    className={[
                      "relative flex items-center gap-3 p-4 bg-gradient-to-br text-white",
                      activeMeta.gradient,
                    ].join(" ")}
                  >
                    <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-base font-bold backdrop-blur-sm">
                      {getUserInitial()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {user.fullName}
                      </p>
                      <p className="truncate text-xs opacity-80">
                        {user.email}
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold capitalize">
                        {activeMeta.label}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-3">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Navigation
                </p>
                {navLinks.map(({ name, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "mb-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all",
                        active
                          ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200/40"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "h-4 w-4",
                          active ? "text-white" : "text-gray-400",
                        ].join(" ")}
                      />
                      {name}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="shrink-0 border-t border-gray-100 p-3 space-y-0.5">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/client/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      <UserCircle className="h-4 w-4 text-gray-400" />
                      My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 text-red-400" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-md"
                  >
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Dropdown sub-components ──────────────────────────────────────────────────

function DropdownLink({
  href,
  icon,
  label,
  sub,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all hover:bg-gray-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-all group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-200">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

function DropdownButton({
  icon,
  label,
  sub,
  accent,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all",
        accent ? "hover:bg-violet-50" : "hover:bg-gray-50",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all group-hover:shadow-md",
          accent
            ? "bg-violet-50 text-violet-500 group-hover:bg-violet-500 group-hover:text-white group-hover:shadow-violet-200"
            : "bg-gray-100 text-gray-500 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-200",
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
