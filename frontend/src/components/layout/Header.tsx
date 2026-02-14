"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  Bell,
  LogOut,
  UserCircle,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- CLICK OUTSIDE ---------------- */
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
        !(e.target as Element).closest('button[aria-label="Toggle mobile menu"]')
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- FETCH USER ---------------- */
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await userAuthService.getMe();
    
        
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  /* ---------------- CLOSE MOBILE ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLoggedIn = !!user;

  /* ---------------- LOGOUT ---------------- */
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

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role !== "nutritionist") {
        router.push("/not-authorized");
      }
    }
  }, [user, loading, router]);

  /* ---------------- DASHBOARD NAVIGATION (FIXED) ---------------- */
  const handleNutritionistDashboard = () => {
    setOpen(false);
    setMobileOpen(false);

    if (!user) {
      return router.push("/");
    }

    const { role, nutritionistStatus } = user;

    if (role !== "nutritionist") {
      return router.push("/not-authorized");
    }

    if (nutritionistStatus === "approved") {
      return router.push("/nutritionist/dashboard");
    }

    if (nutritionistStatus === "pending") {
      return router.push("/nutritionist/details?status=pending");
    }

    if (nutritionistStatus === "rejected") {
      return router.push("/nutritionist/reapply");
    }

    router.push("/nutritionist/details");
  };

  const getUserInitial = () => {
    if (user?.fullName) return user.fullName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="h-16 flex items-center px-6">
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </header>
    );
  }

  const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Challenges", href: "/challenges" },
    { name: "Nutritionists", href: "/coaching" },
    { name: "Communities", href: "/communities" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-base sm:text-lg">🍃</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NutriWise
            </span>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3">

            {isLoggedIn && (
              <button className="p-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-600 relative transition-all group">
                <Bell className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg" />
              </button>
            )}

            {/* USER DROPDOWN (Desktop & Tablet) */}
            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="cursor-pointer w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-full flex items-center justify-center text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {getUserInitial()}
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-dropdown">

                    {/* User Info Header */}
                    <div className="px-5 py-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-b border-emerald-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {getUserInitial()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {user?.role === "nutritionist" && (
                        <div className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xs font-semibold text-white shadow-sm">
                          ✨ Nutritionist
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/client/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-sm font-medium text-gray-700 hover:text-emerald-700 transition-all group"
                      >
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600 rounded-lg flex items-center justify-center transition-all">
                          <UserCircle className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                        <span>My Profile</span>
                      </Link>

                      {user?.role === "nutritionist" && (
                        <button
                          onClick={handleNutritionistDashboard}
                          className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-sm font-medium text-gray-700 hover:text-emerald-700 transition-all group"
                        >
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600 rounded-lg flex items-center justify-center transition-all">
                            <Settings className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                          </div>
                          <span>Dashboard</span>
                        </button>
                      )}
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-sm font-medium text-red-600 hover:text-red-700 transition-all group"
                      >
                        <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-all">
                          <LogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block px-4 sm:px-5 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              >
                Login
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 hover:bg-emerald-50 rounded-lg transition-colors"
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
            className="lg:hidden border-t border-gray-200 bg-white animate-mobile-menu"
          >
            <div className="py-4 space-y-1">
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* User Section (Mobile) */}
              {isLoggedIn ? (
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-1">
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-lg mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                        {getUserInitial()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    {user?.role === "nutritionist" && (
                      <div className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full text-xs font-semibold text-white shadow-sm mt-2">
                        ✨ Nutritionist
                      </div>
                    )}
                  </div>

                  {/* Profile Link */}
                  <Link
                    href="/client/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>

                  {/* Dashboard (Nutritionist only) */}
                  {user?.role === "nutritionist" && (
                    <button
                      onClick={handleNutritionistDashboard}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-all text-left"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-center bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes mobile-menu {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
        .animate-mobile-menu {
          animation: mobile-menu 0.3s ease-out;
        }
      `}</style>
    </header>
  );
}