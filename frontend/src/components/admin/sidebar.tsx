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
  Menu,
} from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";

interface NavItem {
  name: string;
  icon: React.ComponentType<any>;
  path: string;
  badge?: string;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" }],
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users" },
      { name: "Nutritionists", icon: Stethoscope, path: "/admin/nutritionists" },
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
  const [collapsed, setCollapsed] = useState(false);
  const [showDropup, setShowDropup] = useState(false);
  const dropupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(e.target as Node))
        setShowDropup(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    }
  };

  return (
  <aside
  className={`fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-slate-200 flex flex-col z-50 transition-all duration-300
    ${collapsed ? "w-20" : "w-72"}
    hidden lg:flex
    `}>
      {/* Logo + Toggle */}
      <div className="p-6 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-slate-800">NutriWise</h2>
              <p className="text-xs text-slate-500 font-medium">Admin Portal</p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        {navSections.map((section, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                    ${isActive ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}
                  `}
                >
                  <item.icon className="w-5 h-5 shrink-0" strokeWidth={2.3} />
                  {!collapsed && <span className="flex-1 text-left">{item.name}</span>}
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Notifications */}
      <button
        onClick={() => router.push("/admin/notifications")}
        className="m-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 transition shadow-sm group"
      >
        <Bell className="w-5 h-5" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium">Notifications</span>
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-lg">5</span>
          </>
        )}
      </button>

      {/* Profile Dropup */}
      <div ref={dropupRef} className="p-4 border-t border-slate-200 bg-white relative">
        <button
          onClick={() => setShowDropup(!showDropup)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            AD
          </div>
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold">Admin</p>
              <p className="text-xs text-slate-500">admin@nutriwise.com</p>
            </div>
          )}
          {!collapsed && (
            <ChevronUp
              className={`w-4 h-4 transition ${showDropup ? "rotate-180" : ""}`}
            />
          )}
        </button>

        {showDropup && !collapsed && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => router.push("/admin/profile")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm"
            >
              <User className="w-4 h-4" /> View Profile
            </button>
            <button
              onClick={() => router.push("/admin/settings")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-sm"
            >
              <Settings className="w-4 h-4" /> Settings
            </button>
            <div className="border-t" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-slate-50 text-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
