"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  UserCircle,
  Menu,
  X,
  Check,
  ChevronDown,
  Stethoscope,
  ArrowRight,
  Clock,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

import {
  logout,
  setAccessToken,
  setActiveRole,
} from "@/redux/slices/authSlice";
import { showLoading, hideLoading } from "@/redux/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/userAuth.service";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import Logo from "./Logo";
import { UserRole } from "@/types/user/user.types";
import NotificationBell from "@/components/notification/NotificationBell";

type Role = "user" | "nutritionist";
type CtaKey = "none" | "pending" | "rejected" | "approved";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Challenges", href: "/challenges" },
  { name: "Nutritionists", href: "/coaching" },
  { name: "Communities", href: "/communities/groups" },
];

const CTA: Record<
  Exclude<CtaKey, "approved">,
  {
    icon: LucideIcon;
    title: string;
    pill?: string;
    pillClass?: string;
    pulse?: boolean;
  }
> = {
  none: { icon: Stethoscope, title: "Become a Nutritionist" },
  pending: {
    icon: Clock,
    title: "Application under review",
    pill: "Pending",
    pillClass: "text-amber-600",
    pulse: true,
  },
  rejected: {
    icon: AlertCircle,
    title: "Update your application",
    pill: "Needs changes",
    pillClass: "text-rose-600",
  },
};

function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

function Avatar({
  name,
  email,
  size = "w-9 h-9",
}: {
  name?: string;
  email?: string;
  size?: string;
}) {
  const initial = (name || email || "U")[0].toUpperCase();
  return (
    <span
      className={`${size} shrink-0 rounded-full bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center`}
    >
      {initial}
    </span>
  );
}

type AuthUser = NonNullable<RootState["auth"]["user"]>;

type AccountPanelProps = {
  user: AuthUser;
  switching: boolean;
  onSwitchRole: (role: Role) => void;
  onLogout: () => void;
};

function AccountPanel({
  user,
  switching,
  onSwitchRole,
  onLogout,
}: AccountPanelProps) {
  const status: CtaKey = user.nutritionistStatus ?? "none";
  const isApproved =
    status === "approved" && user.roles?.includes("nutritionist");
  const activeRole: UserRole = user.activeRole ?? "user";
  const cta = status === "approved" ? null : CTA[status];

  return (
    <div className="space-y-2">
      <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
        <div className="flex items-center gap-3">
          <Avatar name={user.fullName} email={user.email} size="w-10 h-10" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user.fullName || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {isApproved && (
          <div className="mt-3 flex gap-1 p-1 bg-white border border-emerald-100 rounded-xl">
            {(["user", "nutritionist"] as const).map((role) => (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                disabled={switching}
                aria-pressed={activeRole === role}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  activeRole === role
                    ? "bg-emerald-600 text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {activeRole === role && <Check className="w-3 h-3" />}
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/user/dashboard"
        className="group flex items-center gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:bg-emerald-50 transition-colors"
      >
        <span className="w-10 h-10 shrink-0 rounded-xl bg-white ring-1 ring-emerald-100 flex items-center justify-center">
          <UserCircle className="w-5 h-5 text-emerald-600" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-semibold text-slate-900">
            Dashboard
          </span>
          <span className="block text-xs text-slate-500">
            Your progress, plans & activity
          </span>
        </span>
        <ArrowRight className="w-4 h-4 text-emerald-600 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {cta && (
        <Link
          href={
            status === "none"
              ? "/user/nutritionist/application"
              : "/user/nutritionist/application/status"
          }
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="relative">
            <cta.icon className="w-4 h-4 text-slate-400" />
            {cta.pulse && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </span>
          <span className="flex-1">{cta.title}</span>
          {cta.pill && (
            <span className={`text-[10px] font-semibold ${cta.pillClass}`}>
              {cta.pill}
            </span>
          )}
        </Link>
      )}

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:bg-red-50"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const user = useAppSelector((s) => s.auth.user);
  const loading = useAppSelector((s) => s.auth.loading);

  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useDismiss(dropdownRef, menuOpen, closeMenu);
  useDismiss(headerRef, mobileOpen, closeMobile);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    dispatch(showLoading("Logging out..."));
    try {
      await userAuthService.logout();
      dispatch(logout());
      router.replace("/");
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => dispatch(hideLoading()), 300);
    }
  };

  const handleSwitchRole = async (role: Role) => {
    if (!user || switching || role === (user.activeRole ?? "user")) return;

    setSwitching(true);
    setMenuOpen(false);
    setMobileOpen(false);

    try {
      const res = await userAuthService.switchRole(role);
      const token = res.data?.accessToken;

      if (!res.success || !token) {
        throw new Error("Failed to switch role.");
      }

      tokenStorage.set(token);
      dispatch(setAccessToken(token));
      dispatch(setActiveRole(role));

      document.cookie = [
        `nutriwise_active_role=${role}`,
        "Path=/",
        "SameSite=Lax",
        ...(window.location.protocol === "https:" ? ["Secure"] : []),
      ].join("; ");

      router.push(
        role === "nutritionist" ? "/nutritionist/dashboard" : "/user/dashboard",
      );

      router.refresh();
    } catch (err) {
      console.error("Failed to switch role:", err);
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="w-32 h-8 rounded-xl bg-slate-100 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </header>
    );
  }

  const panelProps = user && {
    user,
    switching,
    onSwitchRole: handleSwitchRole,
    onLogout: handleLogout,
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          <Logo size="default" href="/" />

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ name, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    active
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <NotificationBell notificationsHref="/user/notifications" />

                <div ref={dropdownRef} className="relative hidden lg:block">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-expanded={menuOpen}
                    aria-label="Account menu"
                    className="flex items-center gap-1.5 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <Avatar name={user.fullName} email={user.email} />
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {menuOpen && panelProps && (
                    <div className="absolute right-0 mt-3 w-72 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-emerald-900/10">
                      <AccountPanel {...panelProps} />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-xl hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 max-h-[calc(100dvh-4rem)] overflow-y-auto">
            <div className="space-y-0.5">
              {NAV_LINKS.map(({ name, href }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {name}
                  </Link>
                );
              })}
            </div>

            {panelProps && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <AccountPanel {...panelProps} />
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
