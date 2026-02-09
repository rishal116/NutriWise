"use client"
import { useState } from "react";
import {
  Home, Calendar, Video, Users, FileText, Globe, Mail,
  DollarSign, Settings, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Subcriptions", href: "/nutritionist/subcriptions", icon: Calendar },
  { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Resource Records", href: "/nutritionist/records", icon: FileText },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail, badge: 3 },
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

export default function NutritionistSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <aside
      className={`fixed left-0 top-20 z-40
        h-[calc(100vh-80px)]
        bg-white
        border-r border-gray-200
        transition-all duration-300 ease-in-out
        flex flex-col
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className={`px-4 py-5 border-b border-gray-200 flex items-center
        ${collapsed ? "justify-center" : "justify-between"}
      `}>
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                NutriWise
              </h1>
              <p className="text-xs text-gray-500">Health Platform</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors
            ${collapsed ? "mx-auto" : ""}
          `}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {menu.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href;

            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`
                  w-full flex items-center gap-3 rounded-lg px-3 py-2.5
                  transition-all duration-200
                  ${collapsed ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-emerald-600" : "text-gray-600"
                    }`}
                  />
                  {badge && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
                        bg-red-500 text-white text-[10px] font-semibold rounded-full
                        flex items-center justify-center"
                    >
                      {badge}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <span
                    className={`font-medium text-sm flex-1 text-left ${
                      isActive ? "text-emerald-700" : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                )}

                {!collapsed && isActive && (
                  <div className="w-1 h-1 rounded-full bg-emerald-600"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}