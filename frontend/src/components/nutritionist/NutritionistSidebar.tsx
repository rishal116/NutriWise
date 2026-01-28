"use client"
import { useState } from "react";
import {
  Home, Calendar, Video, Users, FileText, Globe, Mail,
  DollarSign, Settings, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "plans", href: "/nutritionist/appointments", icon: Calendar },
  { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Resource Records", href: "/nutritionist/records", icon: FileText },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail, badge: 3 },
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

export default function NutritionistSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
<aside
  className={`fixed left-0 top-20 z-40
    h-[calc(100vh-80px)]
    bg-gradient-to-b from-white via-emerald-50/20 to-white
    shadow-2xl border-r border-emerald-100/50
    transition-all duration-500 ease-in-out
    flex flex-col
    ${collapsed ? "w-20" : "w-70"}
  `}
>
      {/* Logo Section */}
      <div className={`border-b border-emerald-100/50 flex items-center transition-all duration-300
        ${collapsed ? "px-4 py-6 justify-center" : "px-6 py-6 justify-between"}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 animate-pulse"></div>
                <Sparkles className="w-6 h-6 text-white relative z-10" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                NutriWise
              </h1>
              <p className="text-xs text-gray-500 font-medium">Health Platform</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hover:bg-emerald-100 bg-white p-2.5 rounded-xl transition-all duration-300 shadow-sm border border-emerald-100 hover:shadow-md hover:scale-105 group
            ${collapsed ? "mx-auto" : ""}
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-emerald-600 group-hover:-translate-x-0.5 transition-transform" />
          )}
        </button>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">
        {menu.map(({ href, label, icon: Icon, badge }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 relative group overflow-hidden
              ${collapsed ? "justify-center px-2" : ""}
              text-gray-700 hover:bg-emerald-100 hover:shadow-md
            `}
          >
            <div className="relative flex items-center justify-center">
              <Icon className="w-5 h-5 relative z-10 group-hover:text-emerald-600 transition-transform duration-300" />
              {badge && (
                <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse
                  ${collapsed ? "-right-1" : ""}
                `}>
                  {badge}
                </span>
              )}
            </div>

            {!collapsed && (
              <span className="font-semibold text-sm">{label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}