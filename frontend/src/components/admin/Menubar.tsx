"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Command } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "System overview & analytics" },
  users: { title: "Users", subtitle: "Member management" },
  nutritionists: { title: "Nutritionists", subtitle: "Verified professionals" },
  challenges: { title: "Challenges", subtitle: "Active health programs" },
  posts: { title: "Posts", subtitle: "Community content" },
  payments: { title: "Payments", subtitle: "Transaction history" },
  settings: { title: "Settings", subtitle: "System configuration" },
  community: { title: "Community", subtitle: "Engagement metrics" },
  notifications: { title: "Notifications", subtitle: "Recent alerts" },
  profile: { title: "Profile", subtitle: "Personal settings" },
};

export default function Navbar() {
  const pathname = usePathname();
  const section = pathname.split("/")[2];
  
  const currentPage = PAGE_TITLES[section] || {
    title: "Admin Panel",
    subtitle: "NutriWise Administration",
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex justify-between items-center px-6 h-16">
        
        {/* Left: Breadcrumb/Title */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {currentPage.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search Shortcut Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg mr-2 group hover:border-emerald-200 transition-colors cursor-pointer">
            <Search size={14} className="text-slate-400 group-hover:text-emerald-500" />
            <span className="text-[11px] text-slate-400 font-medium">Search...</span>
            <kbd className="ml-4 px-1.5 py-0.5 text-[9px] font-sans font-semibold text-slate-400 bg-white border border-slate-200 rounded">
              <Command size={10} className="inline mr-0.5" /> K
            </kbd>
          </div>

          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </button>

          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}