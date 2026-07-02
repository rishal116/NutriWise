"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Bell, LogOut, UserCircle, Settings, Menu, X } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";
import { User } from "@/types/user/user.types";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !(e.target as Element).closest(
          'button[aria-label="Toggle mobile menu"]',
        )
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await userAuthService.getMe();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLoggedIn = !!user;

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      localStorage.removeItem("token");
      dispatch(logout());
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNutritionistDashboard = () => {
    setOpen(false);
    setMobileOpen(false);
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.roles.includes("nutritionist")) {
      router.push("/nutritionist/dashboard");
      return;
    }
    router.push("/nutritionist/details");
  };

  const getUserInitial = () => {
    if (user?.fullName) return user.fullName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Nutritionists", href: "/coaching" },
    { name: "Communities", href: "/communities" },
  ];

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="w-32 h-8 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm shadow-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Logo size="default" href="/home" />

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                aria-label="Notifications"
                className="p-2 rounded-xl hover:bg-gray-50 transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
            )}

            {/* USER DROPDOWN */}
            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-colors"
                >
                  {getUserInitial()}
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 z-50 overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-4 bg-emerald-50/60 border-b border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {getUserInitial()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {user?.roles.includes("nutritionist") && (
                        <div className="inline-flex items-center px-2.5 py-1 bg-emerald-600 rounded-full text-xs font-semibold text-white mt-3">
                          Nutritionist
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1.5">
                      <Link
                        href="/client/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        <UserCircle className="w-4 h-4 text-gray-400" />
                        My Profile
                      </Link>

                      {user?.roles.includes("nutritionist") && (
                        <button
                          onClick={handleNutritionistDashboard}
                          className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          Dashboard
                        </button>
                      )}
                    </div>

                    <div className="border-t border-gray-100 py-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                Login
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t border-gray-100 bg-white"
          >
            <div className="py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {isLoggedIn ? (
                <div className="pt-3 mt-2 border-t border-gray-100 space-y-0.5">
                  <div className="px-4 py-3 bg-emerald-50/60 rounded-xl mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {getUserInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {user?.roles.includes("nutritionist") && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-emerald-600 rounded-full text-xs font-semibold text-white mt-2">
                        Nutritionist
                      </div>
                    )}
                  </div>

                  <Link
                    href="/client/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <UserCircle className="w-4 h-4 text-gray-400" />
                    My Profile
                  </Link>

                  {user?.roles.includes("nutritionist") && (
                    <button
                      onClick={handleNutritionistDashboard}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-3 mt-2 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
