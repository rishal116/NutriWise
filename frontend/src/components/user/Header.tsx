"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Bell, ChevronDown, LogOut, UserCircle, Settings } from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

// Toggle dropdown
const toggleDropdown = () => {
  setOpen((prev) => !prev);
};

// Close when clicking outside
useEffect(() => {
  const handleClickOutside = (e: any) => {
    const dropdown = document.getElementById("user-dropdown");
    if (dropdown && !dropdown.contains(e.target)) {
      setOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);


  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    setLoading(false);
    return;
  }

  const fetchMe = async () => {
    try {
      const res = await userAuthService.getMe();
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchMe();
}, []);


  const isLoggedIn = !!user;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Nutritionists", href: "/nutritionists" },
    { name: "Communities", href: "/communities" },
  ];
  
  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      localStorage.removeItem("token");
      dispatch(logout());
      setUser(null);
      setOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const handleNutritionistDashboard = async () => {
    setOpen(false);
    try {
      const res = await userAuthService.getMe();
      const { role, nutritionistStatus } = res.user;

      if (role !== "nutritionist") return router.push("/not-authorized");

      if (nutritionistStatus === "approved")
        return router.push("/nutritionist/dashboard");

      if (nutritionistStatus === "pending")
        return router.push("/nutritionist/details?status=pending");

      if (nutritionistStatus === "rejected")
        return router.push("/nutritionist/reapply");

      return router.push("/nutritionist/details");
    } catch (error) {
      console.error("Failed to fetch status:", error);
    }
  };

  const getUserInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍃</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              NutriWise
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 font-medium transition-colors duration-200 rounded-lg group ${
                  pathname === link.href ? "text-green-600" : "text-gray-700"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {pathname === link.href ? (
                  <span className="absolute inset-0 bg-green-50 rounded-lg"></span>
                ) : (
                  <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-90 transition-opacity duration-200"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <button className="relative p-2 hover:bg-gray-50 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-700 hover:text-green-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* Before login */}
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition shadow-sm"
                >
                  Get Started
                </button>
                                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-700 hover:text-green-600 font-medium transition"
                >
                  Login
                </button>
              </>
            ) : (
              /* Profile dropdown */
<div id="user-dropdown" className="relative">
  <button
    onClick={toggleDropdown}
    className="flex items-center space-x-2 px-2 py-2 rounded-lg transition cursor-pointer"
  >
    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
      {getUserInitial()}
    </div>
  </button>

                {open && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-pointer"
                      onClick={() => setOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50">
                      {/* User Info Section */}
                      <div className="px-4 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100 cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer">
                            {getUserInitial()}
                          </div>
                          <div className="flex-1 min-w-0">
                            {user?.name && (
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {user.name}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setOpen(false);
                            router.push("/profile");
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <UserCircle size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500">View and edit profile</p>
                          </div>
                        </button>

                        {user?.role === "nutritionist" && (
                          <button
                            onClick={handleNutritionistDashboard}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <Settings size={18} className="text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Dashboard</p>
                              <p className="text-xs text-gray-500">Manage your workspace</p>
                            </div>
                          </button>
                        )}

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition cursor-pointer"
                          >
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                              <LogOut size={18} className="text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium">Logout</p>
                              <p className="text-xs text-red-500">Sign out of your account</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}