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
        console.log(res);
        
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
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
              🍃
            </div>
            <span className="text-xl font-bold text-gray-900">
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
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {isLoggedIn && (
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            )}

            {/* USER DROPDOWN */}
            {isLoggedIn ? (
              <div ref={dropdownRef} className="relative hidden sm:block">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-semibold"
                >
                  {getUserInitial()}
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50">

                    <div className="px-4 py-3 border-b bg-gray-50">
                      <p className="text-sm font-semibold truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/account/profile"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
                      >
                        <UserCircle size={18} />
                        Profile
                      </Link>

                      {user?.role === "nutritionist" && (
                        <button
                          onClick={handleNutritionistDashboard}
                          className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          <Settings size={18} />
                          Dashboard
                        </button>
                      )}
                    </div>

                    <div className="border-t">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-sm text-red-600"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600"
              >
                Login
              </Link>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>

          </div>
        </div>
      </nav>
    </header>
  );
}
