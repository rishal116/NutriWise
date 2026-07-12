"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  User as UserIcon,
  LogOut,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/userAuth.service";
import type { User } from "@/types/user/user.types";
import Logo from "../common/Logo";

export default function NutritionistHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await userAuthService.getMe();
        setUser(res.data);
      } catch (err) {
        console.error("Header fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchRole = async (role: "user" | "nutritionist") => {
    if (!user || role === user.activeRole || switching) return;
    setSwitching(true);
    try {
      await userAuthService.switchRole(role);
      setUser((prev) => (prev ? { ...prev, activeRole: role } : prev));
      router.push(
        role === "user" ? "/user/dashboard" : "/nutritionist/dashboard",
      );
    } catch (err) {
      console.error("Role switch error:", err);
    } finally {
      setSwitching(false);
      setMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const canSwitchToUser = user?.roles.includes("user");

  if (loading) {
    return (
      <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="w-32 h-8 bg-slate-100 rounded-xl animate-pulse" />
          <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Logo href="/nutritionist/dashboard" />

          {/* Right: tools + profile */}
          <div className="flex items-center gap-2">
            {/* Notifications — wire a real service here when the endpoint exists */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2 rounded-xl transition-all duration-200 ${
                  notifOpen
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-50 hover:text-emerald-600"
                }`}
              >
                <Bell className="h-5 w-5" />
              </button>

              {notifOpen && (
                <div className="absolute right-[-40px] sm:right-0 mt-3 w-[calc(100vw-32px)] sm:w-96 bg-white shadow-xl shadow-emerald-900/10 border border-slate-200 rounded-2xl overflow-hidden z-50">
                  <div className="px-4 py-4 bg-emerald-50/40 border-b border-emerald-100">
                    <h3 className="font-bold text-emerald-900 text-sm">
                      Notifications
                    </h3>
                  </div>
                  <div className="p-8 text-center">
                    <CheckCircle2
                      className="mx-auto text-emerald-100 mb-3"
                      size={36}
                    />
                    <p className="text-sm font-medium text-slate-400">
                      All caught up!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-slate-900 truncate w-24">
                    {user?.fullName ? `Dr. ${user.fullName}` : "Nutritionist"}
                  </p>
                  <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wide">
                    Expert
                  </p>
                </div>
                <div className="relative w-9 h-9 shrink-0">
                  <Image
                    src={user?.profileImage || "/images/images.jpg"}
                    fill
                    className="rounded-full object-cover border-2 border-white shadow-sm"
                    alt="Profile"
                    unoptimized
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl shadow-emerald-900/10 border border-slate-200 rounded-2xl overflow-hidden z-50">
                  <div className="px-4 py-4 border-b border-slate-100 bg-emerald-50/40">
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {canSwitchToUser && (
                    <div className="px-3 pt-3">
                      <p className="text-[11px] font-semibold text-emerald-700/70 uppercase tracking-wide mb-1.5 px-0.5">
                        Viewing as
                      </p>
                      <div className="flex items-center bg-white border border-emerald-100 rounded-xl p-1 gap-1">
                        {(["nutritionist", "user"] as const).map((role) => (
                          <button
                            key={role}
                            onClick={() => handleSwitchRole(role)}
                            disabled={switching}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                              user?.activeRole === role
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                            }`}
                          >
                            {user?.activeRole === role && (
                              <Check className="w-3 h-3" />
                            )}
                            {role === "user" ? "User" : "Nutritionist"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-1.5 mt-1">
                    <button
                      onClick={() => {
                        router.push("/nutritionist/profile");
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 rounded-xl flex items-center gap-3 text-sm text-slate-700 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-slate-400" /> My Profile
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 hover:bg-red-50 rounded-xl flex items-center gap-3 text-sm text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
