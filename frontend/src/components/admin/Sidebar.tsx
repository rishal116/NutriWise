"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Trophy,
  FileText,
  CreditCard,
  MessageSquare,
  Menu,
  ChevronLeft,
  ChevronDown,
  X,
  LucideIcon,
} from "lucide-react";
import Logo from "../common/Logo";

interface NavChild {
  name: string;
  path: string;
  badge?: number;
}

interface NavItem {
  name: string;
  icon: LucideIcon;
  path?: string;
  children?: NavChild[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

// TODO: replace with real pending-applications count from API

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    ],
  },
  {
    title: "Management",
    items: [
      { name: "Users", icon: Users, path: "/admin/users" },
      {
        name: "Nutritionists",
        icon: Stethoscope,
        children: [
          { name: "All Nutritionists", path: "/admin/nutritionists" },
          {
            name: "Applications",
            path: "/admin/nutritionists/applications",
          },
        ],
      },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Posts", icon: FileText, path: "/admin/posts" },
    ],
  },
  {
    title: "Finance & Community",
    items: [
      { name: "Payments", icon: CreditCard, path: "/admin/payments" },
      { name: "Community", icon: MessageSquare, path: "/admin/community" },
    ],
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (item.children?.some((c) => pathname.startsWith(c.path))) {
          return item.name;
        }
      }
    }
    return null;
  });

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 h-screen bg-admin-surface border-r border-admin-border flex flex-col z-50 transition-all duration-300 ease-in-out
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand row */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-admin-border shrink-0">
          <div className={collapsed ? "lg:mx-auto" : ""}>
            <Logo size="small" href="/admin/dashboard" showText={!collapsed} />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="lg:hidden p-1.5 rounded-lg text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text transition-colors shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hide">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-bold text-admin-muted uppercase tracking-widest">
                  {section.title}
                </h3>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;

                if (item.children) {
                  const isOpen = openGroup === item.name;
                  const groupActive = item.children.some((c) =>
                    pathname.startsWith(c.path),
                  );
                  const totalBadge = item.children.reduce(
                    (sum, c) => sum + (c.badge ?? 0),
                    0,
                  );

                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => {
                          if (collapsed) return;
                          setOpenGroup(isOpen ? null : item.name);
                        }}
                        title={collapsed ? item.name : ""}
                        className={`w-full flex items-center rounded-xl transition-all duration-200 group
                          ${collapsed ? "justify-center h-11 lg:px-0" : "px-3 py-2.5 gap-3"}
                          ${
                            groupActive
                              ? "bg-admin-accent-soft text-admin-accent"
                              : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                          }
                        `}
                      >
                        <span className="relative shrink-0">
                          <Icon
                            className={`w-5 h-5 ${
                              groupActive
                                ? "text-admin-accent"
                                : "group-hover:text-admin-accent"
                            }`}
                          />
                          {collapsed && totalBadge > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-admin-danger text-white text-[9px] font-bold flex items-center justify-center">
                              {totalBadge}
                            </span>
                          )}
                        </span>

                        {!collapsed && (
                          <>
                            <span className="text-sm font-semibold whitespace-nowrap flex-1 text-left">
                              {item.name}
                            </span>
                            {totalBadge > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-admin-danger text-white text-[10px] font-bold flex items-center justify-center">
                                {totalBadge}
                              </span>
                            )}
                            <ChevronDown
                              className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </>
                        )}
                      </button>

                      {!collapsed && (
                        <div
                          className={`overflow-hidden transition-all duration-200 ease-out ${
                            isOpen
                              ? "max-h-40 opacity-100 mt-1"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-[1.35rem] pl-4 border-l border-admin-border space-y-0.5">
                            {item.children.map((child) => {
                              const childActive = pathname.startsWith(
                                child.path,
                              );
                              return (
                                <Link
                                  key={child.path}
                                  href={child.path}
                                  onClick={() => setMobileOpen(false)}
                                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    childActive
                                      ? "bg-admin-accent-soft text-admin-accent font-medium"
                                      : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                                  }`}
                                >
                                  <span className="truncate">{child.name}</span>
                                  {!!child.badge && (
                                    <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-admin-danger text-white text-[10px] font-bold flex items-center justify-center">
                                      {child.badge}
                                    </span>
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path!}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.name : ""}
                    className={`w-full flex items-center rounded-xl transition-all duration-200 group
                      ${collapsed ? "justify-center h-11 lg:px-0" : "px-3 py-2.5 gap-3"}
                      ${
                        isActive
                          ? "bg-admin-accent-soft text-admin-accent"
                          : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                      }
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${
                        isActive
                          ? "text-admin-accent"
                          : "group-hover:text-admin-accent"
                      }`}
                    />
                    {!collapsed && (
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1 h-4 rounded-full bg-admin-accent" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer: collapse toggle only */}
        <div className="p-3 border-t border-admin-border shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden lg:flex w-full items-center text-admin-muted hover:text-admin-accent hover:bg-admin-accent-soft rounded-xl transition-all
              ${collapsed ? "justify-center h-10" : "px-3 py-2 gap-3"}`}
          >
            {collapsed ? (
              <Menu size={20} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
