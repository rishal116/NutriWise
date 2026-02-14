"use client";
import { useState, useEffect } from "react";
import {
  Home, Calendar, Video, Users, FileText, Globe, Mail,
  DollarSign, Settings, ChevronLeft, ChevronRight, Menu, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Subscriptions", href: "/nutritionist/subscriptions", icon: Calendar },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 sm:top-20 z-50 lg:z-40
          h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)]
          bg-white
          border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          shadow-lg lg:shadow-none
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className={`px-4 py-4 sm:py-5 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50`}>
          {!collapsed && (
            <h2 className="font-bold text-gray-900 text-sm sm:text-base">Navigation</h2>
          )}
          
          <div className="flex items-center gap-2">
            {/* Close button for mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Collapse button for desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden lg:block p-2 rounded-xl hover:bg-white transition-colors ${
                collapsed ? "mx-auto" : ""
              }`}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 sm:px-4">
          <div className="space-y-1.5">
            {menu.map(({ href, label, icon: Icon, badge }) => {
              const isActive = pathname === href;

              return (
                <button
                  key={href}
                  onClick={() => {
                    router.push(href);
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 rounded-2xl px-3 sm:px-4 py-3 sm:py-3.5
                    transition-all duration-200 relative group
                    ${collapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-emerald-50"
                    }
                  `}
                >
                  <div className="relative flex-shrink-0">
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                        isActive ? "text-white" : "text-gray-600 group-hover:text-emerald-600"
                      }`}
                    />
                    {badge && !collapsed && (
                      <span
                        className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1
                          bg-red-500 text-white text-[10px] font-bold rounded-full
                          flex items-center justify-center ring-2 ring-white"
                      >
                        {badge}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <span
                      className={`font-semibold text-sm sm:text-base flex-1 text-left ${
                        isActive ? "text-white" : "text-gray-700 group-hover:text-emerald-700"
                      }`}
                    >
                      {label}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {collapsed && (
                    <span className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg">
                      {label}
                      {badge && (
                        <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {badge}
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}