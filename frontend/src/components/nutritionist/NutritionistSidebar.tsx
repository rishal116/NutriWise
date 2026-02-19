"use client";

import React, { useState, useEffect } from "react";
import { 
  Home, Calendar, Video, Users, FileText, Globe, Mail, 
  DollarSign, Settings, ChevronLeft, ChevronRight, Menu, X 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Subscriptions", href: "/nutritionist/subscriptions", icon: Calendar },
  { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Resource Records", href: "/nutritionist/records", icon: FileText },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail, badge: 3},
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

export default function NutritionistSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  return (
    <>
      {/* --- MOBILE FLOATING ACTION BUTTON --- */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl flex items-center justify-center text-white active:scale-90 transition-transform"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* --- MOBILE OVERLAY --- */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          fixed left-0 top-0 lg:top-16 z-50 lg:z-30
          h-full lg:h-[calc(100vh-4rem)]
          bg-white border-r border-emerald-50
          transition-all duration-300 ease-in-out
          flex flex-col shadow-2xl lg:shadow-none
          ${collapsed ? "w-20" : "w-72"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header (Mobile & Desktop) */}
        <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
          {!collapsed && (
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Nutritionist Suite
            </span>
          )}
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-xl hover:bg-white text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 rounded-xl hover:bg-white text-emerald-600 transition-colors"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 custom-scrollbar">
          <div className="space-y-1.5">
            {menu.map(({ href, label, icon: Icon, badge }) => {
              const isActive = pathname === href;

              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`
                    w-full flex items-center gap-3 rounded-xl px-4 py-3
                    transition-all duration-200 relative group
                    ${collapsed ? "justify-center" : "justify-start"}
                    ${isActive 
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-100" 
                      : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"}
                  `}
                >
                  <div className="relative">
                    <Icon size={isActive ? 22 : 20} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                    
                    {/* Badge */}
                    {badge && (
                      <span className={`
                        absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 
                        bg-rose-500 text-white text-[10px] font-bold rounded-full 
                        flex items-center justify-center border-2 border-white
                        ${collapsed ? "scale-90" : ""}
                      `}>
                        {badge}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <span className={`text-sm font-semibold whitespace-nowrap ${isActive ? "text-white" : "text-gray-700"}`}>
                      {label}
                    </span>
                  )}

                  {/* Desktop Tooltip for Collapsed Mode */}
                  {collapsed && (
                    <div className="absolute left-16 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                      {label}
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}

                  {/* Active Indicator Line */}
                  {isActive && !collapsed && (
                    <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ecfdf5;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1fae5;
        }
      `}</style>
    </>
  );
}