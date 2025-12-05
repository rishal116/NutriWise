import { useState } from "react";
import {
  Home, Calendar, Video, Users, FileText, Globe, Mail,
  DollarSign, Settings, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Appointments", href: "/nutritionist/appointments", icon: Calendar },
  { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Resource Records", href: "/nutritionist/records", icon: FileText },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail, badge: 3 },
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

export default function NutritionistSidebar() {
  const [pathname, setPathname] = useState("/nutritionist/dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-white via-emerald-50/20 to-white shadow-2xl border-r border-emerald-100/50 transition-all duration-500 ease-in-out fixed md:static z-50 flex flex-col
        ${collapsed ? "w-20" : "w-72"}
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
        {menu.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <button
              key={href}
              onClick={() => setPathname(href)}
              className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 relative group overflow-hidden
                ${collapsed ? "justify-center px-2" : ""}
                ${active 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200" 
                  : "text-gray-700 hover:bg-white hover:shadow-md"
                }
              `}
            >
              {/* Background hover effect */}
              {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              )}
              
              {/* Active indicator */}
              {active && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-lg"></div>
              )}

              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300
                  ${active ? "scale-110" : "group-hover:scale-110"}
                  ${!active && "group-hover:text-emerald-600"}
                `} />
                {badge && (
                  <span className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white animate-pulse
                    ${collapsed ? "-right-1" : ""}
                  `}>
                    {badge}
                  </span>
                )}
              </div>

              {!collapsed && (
                <span className={`font-semibold text-sm relative z-10 transition-all duration-300
                  ${active ? "translate-x-1" : ""}
                `}>
                  {label}
                </span>
              )}

              {/* Shimmer effect for active item */}
              {active && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className={`border-t border-emerald-100/50 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50
        ${collapsed ? "px-2" : "px-6"}
      `}>
        {!collapsed ? (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-800">Upgrade to Pro</p>
                <p className="text-[10px] text-gray-500">Get unlimited access</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
              Upgrade Now
            </button>
          </div>
        ) : (
          <button className="w-full p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 mx-auto flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </aside>
  );
}