"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Command, Menu } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:     { title: "Dashboard",     subtitle: "System overview & analytics" },
  users:         { title: "Users",         subtitle: "Member management" },
  nutritionists: { title: "Nutritionists", subtitle: "Verified professionals" },
  challenges:    { title: "Challenges",    subtitle: "Active health programs" },
  posts:         { title: "Posts",         subtitle: "Community content" },
  payments:      { title: "Payments",      subtitle: "Transaction history" },
  settings:      { title: "Settings",      subtitle: "System configuration" },
  community:     { title: "Community",     subtitle: "Engagement metrics" },
  notifications: { title: "Notifications", subtitle: "Recent alerts" },
  profile:       { title: "Profile",       subtitle: "Personal settings" },
};

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const section = pathname.split("/")[2] ?? "";

  const currentPage = PAGE_TITLES[section] ?? {
    title: "Admin Panel",
    subtitle: "NutriWise Administration",
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-4">

        {/* ── Left ── */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile hamburger */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>

          {/* Page title */}
          <div className="min-w-0">
            <h1 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none truncate">
              {currentPage.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5 truncate">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Search bar */}
          <button className="hidden sm:flex items-center gap-2 px-3 py-[7px] bg-slate-50 border border-slate-200 rounded-xl mr-1 group hover:border-teal-200 hover:bg-teal-50/40 transition-all duration-200 cursor-pointer">
            <Search size={13} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
            <span className="text-[11px] text-slate-400 font-medium group-hover:text-teal-500 transition-colors">
              Search...
            </span>
            <kbd className="ml-3 inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">
              <Command size={9} />K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={1.8} />
            {/* Unread dot */}
            <span className="absolute top-[9px] right-[9px] w-[7px] h-[7px] bg-teal-500 rounded-full border-2 border-white" />
          </button>

          {/* Settings */}
          <button
            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200"
            aria-label="Settings"
          >
            <Settings size={17} strokeWidth={1.8} />
          </button>

          {/* Avatar pill — visible on md+ */}
          <div className="hidden md:flex items-center gap-2.5 ml-1 pl-3 border-l border-slate-100">
            <div
              className="w-8 h-8 rounded-xl text-white text-[11px] font-bold flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(135deg, #0d9488, #065f46)" }}
            >
              AD
            </div>
            <div className="hidden lg:block">
              <p className="text-[12px] font-bold text-slate-800 leading-none">Super Admin</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Online</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}