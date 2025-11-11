"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Trophy,
  FileText,
  CreditCard,
  Settings,
  MessageSquare,
  Activity,
  Bell,
  ChevronRight,
  User,
  LogOut,
  ChevronUp,
} from "lucide-react";

const navSections = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" }],
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users" },
      { name: "Nutritionists", icon: Stethoscope, path: "/admin/nutritionists", badge: "42" },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Posts", icon: FileText, path: "/admin/posts" },
    ],
  },
  {
    title: "Finance & Community",
    items: [
      { name: "Payments", icon: CreditCard, path: "/admin/payments" },
      { name: "Community", icon: MessageSquare, path: "/admin/community" },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropup, setShowDropup] = useState(false);
  const dropupRef = useRef<HTMLDivElement>(null);

  // ---------------- Click outside dropup ----------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(event.target as Node)) {
        setShowDropup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Logout ----------------
const handleLogout = () => {
  localStorage.removeItem("adminAccessToken");
  console.log("Logging out, navigating to /admin/login");
  router.push("/admin/login");
};


  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-50 to-white shadow-xl border-r border-slate-200 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">NutriWise</h2>
            <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                      ${isActive
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                        : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-md"
                      }`}
                  >
                    {item.icon && (
                      <item.icon
                        className={`w-5 h-5 transition-transform group-hover:scale-110 relative z-10 ${
                          isActive ? "text-white" : "text-slate-500"
                        }`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    )}
                    <span className="relative z-10 flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`relative z-10 text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-4 h-4 relative z-10" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Notifications */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <button
          onClick={() => router.push("/admin/notifications")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 relative rounded-xl transition-all duration-200 shadow-sm border border-slate-200 group"
        >
          <div className="relative">
            <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </div>
          <span className="text-sm font-medium flex-1 text-left">Notifications</span>
          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
            5
          </span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200 bg-white relative" ref={dropupRef}>
        {showDropup && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-yellow-400 rounded-xl shadow-2xl border border-yellow-500 overflow-hidden animate-in slide-in-from-bottom-2 duration-200 opacity-100">
            <div className="py-2">
              <button
                onClick={() => {
                  router.push("/admin/profile");
                  setShowDropup(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-yellow-300 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">View Profile</span>
              </button>
              <button
                onClick={() => {
                  router.push("/admin/settings");
                  setShowDropup(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-800 hover:bg-yellow-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <div className="my-1 border-t border-yellow-500"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-yellow-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowDropup(!showDropup)}
          className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
            AD
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-semibold text-slate-800 truncate">Admin User</p>
            <p className="text-xs text-slate-500 truncate">admin@nutriwise.com</p>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              showDropup ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </aside>
  );
}
