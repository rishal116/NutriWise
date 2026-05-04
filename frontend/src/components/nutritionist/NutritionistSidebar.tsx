"use client";

import React, { useState } from "react";
import { 
  Home, Video, Users, FileText, Globe, Mail, 
  DollarSign, Settings, ChevronLeft, ChevronRight, X 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Live session", href: "/nutritionist/session", icon: Video },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Meetings", href: "/nutritionist/meeting", icon: Video },
  { label: "Records", href: "/nutritionist/records", icon: FileText },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail, badge: 3 },
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function NutritionistSidebar({ isMobileOpen, onMobileClose, onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapseChange?.(newState);
  };

  return (
    <aside
      className={`
        fixed left-0 z-[50] lg:z-30
        top-16 lg:top-16 
        h-[calc(100vh-64px)]
        bg-white border-r border-slate-200/60
        transition-all duration-300 ease-in-out flex flex-col
        ${collapsed ? "w-20" : "w-60"}
        ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Sidebar Header - Comfortable Height */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-slate-50">
        {!collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Navigation
          </span>
        )}
        
        <button 
          onClick={isMobileOpen ? onMobileClose : handleCollapse}
          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
        >
          {isMobileOpen ? <X size={18} /> : collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Links - Balanced Spacing for Eye Comfort */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5 custom-scrollbar">
        {menu.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`
                group relative flex items-center py-2.5 w-full rounded-xl transition-all
                ${collapsed ? "justify-center" : "px-4 gap-3.5"}
                ${isActive ? "text-emerald-700 bg-emerald-50/80" : "text-slate-500 hover:bg-slate-50/80"}
              `}
            >
              {/* Active Indicator Bar - Slightly thicker for better visibility */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
              )}

              <div className="relative">
                <Icon 
                  size={19} 
                  strokeWidth={isActive ? 2 : 1.5} 
                  className={isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-500"} 
                />
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-[16px] bg-emerald-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-white px-0.5">
                    {badge}
                  </span>
                )}
              </div>

              {!collapsed && (
                <span className={`text-[13.5px] tracking-tight ${isActive ? "font-bold" : "font-medium"}`}>
                  {label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-[11px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {label}
                </div>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}