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
  MessageSquare,
  Activity,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  LucideIcon,
} from "lucide-react";
import { adminAuthService } from "@/services/admin/adminAuth.service";

interface NavItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const NAV_SECTIONS: NavSection[] = [
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

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropup, setShowDropup] = useState(false);
  const dropupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropupRef.current && !dropupRef.current.contains(e.target as Node)) {
        setShowDropup(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-64"} hidden lg:flex`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-50 shrink-0">
        <div className={`flex items-center gap-3 ${collapsed ? "mx-auto" : "ml-1"}`}>
          <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-100 shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-slate-800 tracking-tight whitespace-nowrap">
              NutriWise
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hide">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  title={collapsed ? item.name : ""}
                  className={`w-full flex items-center rounded-xl transition-all duration-200 group
                    ${collapsed ? "justify-center h-11" : "px-3 py-2.5 gap-3"}
                    ${isActive 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-emerald-600" : "group-hover:text-emerald-500"}`} />
                  {!collapsed && <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>}
                  {isActive && !collapsed && <div className="ml-auto w-1 h-4 rounded-full bg-emerald-500" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-100 space-y-2 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all
            ${collapsed ? "justify-center h-10" : "px-3 py-2 gap-3"}`}
        >
          {collapsed ? <Menu size={20} /> : (
            <>
              <ChevronLeft size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Collapse</span>
            </>
          )}
        </button>

        <div ref={dropupRef} className="relative">
          <button
            onClick={() => setShowDropup(!showDropup)}
            className={`w-full flex items-center rounded-xl transition-all border border-transparent
              ${collapsed ? "justify-center h-12 bg-slate-50" : "p-2 gap-3 bg-slate-50 hover:border-slate-200"}`}
          >
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0">
              AD
            </div>
            {!collapsed && (
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-bold text-slate-800 truncate leading-none">Admin</p>
                <p className="text-[10px] text-slate-500 truncate mt-1">admin@nutriwise.com</p>
              </div>
            )}
          </button>

          {showDropup && (
            <div className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-1 w-48 
              ${collapsed ? "left-full ml-2" : "left-0 w-full"}`}>
              <button 
                onClick={() => router.push("/admin/profile")} 
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700"
              >
                <User size={14} /> Profile
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-xs font-medium text-red-600"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}