"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  Users,
  FileText,
  Globe,
  Mail,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const menu = [
  { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
  { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
  { label: "Meetings", href: "/nutritionist/meetings", icon: CalendarDays },
  { label: "My Clients", href: "/nutritionist/clients", icon: Users },
  { label: "Programs", href: "/nutritionist/programs", icon: ClipboardList },
  { label: "Nutrition Plans", href: "/nutritionist/plans", icon: FileText },
  { label: "Resources", href: "/nutritionist/resources", icon: BookOpen },
  { label: "Communities", href: "/nutritionist/communities", icon: Globe },
  { label: "Messages", href: "/nutritionist/messages", icon: Mail },
  { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
  { label: "Settings", href: "/nutritionist/settings", icon: Settings },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function NutritionistSidebar({
  isMobileOpen,
  onMobileClose,
  onCollapseChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Messages needs more width; only force this on desktop — the mobile
    // drawer must stay full width regardless of this route.
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop && pathname.startsWith("/nutritionist/messages")) {
      setCollapsed(true);
      onCollapseChange?.(true);
    }
  }, [pathname, onCollapseChange]);

  useEffect(() => {
    onMobileClose?.();
  }, [pathname, onMobileClose]);

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapseChange?.(next);
  };

  return (
    <aside
      className={`fixed left-0 top-16 z-50 flex h-[calc(100vh-64px)] flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out lg:z-30 ${
        collapsed ? "w-20" : "w-64"
      } ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div
        className={`flex h-14 items-center border-b border-slate-100 lg:h-16 ${
          collapsed ? "justify-center px-0" : "justify-between px-6"
        }`}
      >
        {!collapsed && (
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </span>
        )}

        <button
          onClick={isMobileOpen ? onMobileClose : handleCollapse}
          aria-label={
            isMobileOpen
              ? "Close menu"
              : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          {isMobileOpen ? (
            <X size={18} />
          ) : collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {menu.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              aria-label={collapsed ? label : undefined}
              className={`group relative flex w-full items-center rounded-xl py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                collapsed ? "justify-center" : "gap-3.5 px-4"
              } ${isActive ? "bg-emerald-50/50 text-emerald-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-emerald-600" />
              )}

              <Icon
                size={18}
                strokeWidth={isActive ? 2.5 : 2}
                className={
                  isActive
                    ? "text-emerald-600"
                    : "text-slate-400 group-hover:text-slate-600"
                }
              />

              {!collapsed && (
                <span
                  className={`text-[13px] tracking-tight ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {label}
                </span>
              )}

              {collapsed && (
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
