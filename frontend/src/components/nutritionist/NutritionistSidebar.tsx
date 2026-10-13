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
  ChevronLeft,
  ChevronRight,
  X,
  ClipboardList,
  CalendarDays,
  BookOpen,
  Award,
} from "lucide-react";

const menu = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", href: "/nutritionist/dashboard", icon: Home },
    ],
  },
  {
    section: "Management",
    items: [
      { label: "Live Sessions", href: "/nutritionist/sessions", icon: Video },
      { label: "Meetings", href: "/nutritionist/meetings", icon: CalendarDays },
      { label: "My Clients", href: "/nutritionist/clients", icon: Users },
      { label: "Programs", href: "/nutritionist/programs", icon: ClipboardList },
      { label: "Nutrition Plans", href: "/nutritionist/plans", icon: FileText },
      { label: "Resources", href: "/nutritionist/resources", icon: BookOpen },
      { label: "Groups", href: "/nutritionist/groups", icon: Globe },
      { label: "Messages", href: "/nutritionist/messages", icon: Mail },
    ],
  },
  {
    section: "Account",
    items: [
      { label: "Earnings", href: "/nutritionist/earnings", icon: DollarSign },
      { label: "Credentials", href: "/nutritionist/credentials", icon: Award },
    ],
  },
];

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export default function NutritionistSidebar({
  isMobileOpen = false,
  onMobileClose,
  onCollapseChange,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop && pathname.startsWith("/nutritionist/messages")) {
      setCollapsed(true);
      onCollapseChange?.(true);
    } else {
      setCollapsed(false);
      onCollapseChange?.(false);
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
      className={`fixed bottom-0 left-0 top-16 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-[width,transform] duration-300 ease-in-out lg:z-30 lg:shadow-none ${
        collapsed ? "lg:w-20" : ""
      } ${
        isMobileOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div
        className={`flex h-14 shrink-0 items-center justify-between border-b border-slate-100 px-6 ${
          collapsed ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <span
          className={`text-[11px] font-semibold uppercase tracking-wider text-slate-400 ${
            collapsed ? "lg:hidden" : ""
          }`}
        >
          Navigation
        </span>

        <button
          type="button"
          onClick={isMobileOpen ? onMobileClose : handleCollapse}
          aria-label={
            isMobileOpen
              ? "Close menu"
              : collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
          }
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-50 hover:text-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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

      <nav className="custom-scrollbar flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 py-4">
        {menu.map((group) => (
          <div key={group.section} className="space-y-1">
            <h2
              className={`px-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {group.section}
            </h2>

            {group.items.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  aria-label={collapsed ? label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                    collapsed ? "lg:justify-center lg:gap-0 lg:px-0" : ""
                  } ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-emerald-600" />
                  )}

                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`shrink-0 ${
                      isActive
                        ? "text-emerald-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />

                  <span
                    className={`truncate text-sm tracking-tight ${
                      isActive ? "font-semibold" : "font-medium"
                    } ${collapsed ? "lg:hidden" : ""}`}
                  >
                    {label}
                  </span>

                  {collapsed && (
                    <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
                      {label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}