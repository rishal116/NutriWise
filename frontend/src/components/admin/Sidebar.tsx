"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  BadgeDollarSign,
  Trophy,
  CreditCard,
  Menu,
  ChevronLeft,
  ChevronDown,
  X,
  BookOpen,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

import Logo from "../common/Logo";

interface NavChild {
  name: string;
  path: string;
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
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

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
          { name: "Applications", path: "/admin/nutritionists/applications" },
        ],
      },
      { name: "Challenges", icon: Trophy, path: "/admin/challenges" },
      { name: "Plans", icon: BadgeDollarSign, path: "/admin/plans" },
    ],
  },
  {
    title: "Content",
    items: [
      { name: "Posts", icon: Newspaper, path: "/admin/posts" },
      { name: "Resources", icon: BookOpen, path: "/admin/resources" },
    ],
  },
  {
    title: "Finance",
    items: [{ name: "Payments", icon: CreditCard, path: "/admin/payments" }],
  },
];

function isPathActive(pathname: string, path: string): boolean {
  if (path === "/admin/dashboard") return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** Only the most specific matching child is active (fixes parent/child double highlight). */
function getActiveChildPath(
  pathname: string,
  children: NavChild[],
): string | null {
  const matches = children
    .filter((child) => isPathActive(pathname, child.path))
    .sort((a, b) => b.path.length - a.path.length);

  return matches[0]?.path ?? null;
}

function findGroupForPath(pathname: string): string | null {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.children && getActiveChildPath(pathname, item.children)) {
        return item.name;
      }
    }
  }
  return null;
}

const itemBase =
  "group relative flex w-full items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40";

function itemTone(active: boolean): string {
  return active
    ? "bg-emerald-50 font-semibold text-emerald-800"
    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
}

function IconBox({ icon: Icon, active }: { icon: LucideIcon; active: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150 ${
        active
          ? "bg-emerald-100/80 text-emerald-700"
          : "bg-slate-100/70 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </span>
  );
}

function SidebarLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const active = !!item.path && isPathActive(pathname, item.path);

  return (
    <Link
      href={item.path!}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? item.name : undefined}
      title={collapsed ? item.name : undefined}
      className={`${itemBase} ${itemTone(active)} ${
        collapsed ? "lg:justify-center lg:px-0" : ""
      }`}
    >
      {active && (
        <span className="absolute -left-3 bottom-1.5 top-1.5 w-1 rounded-r-full bg-emerald-600" />
      )}
      <IconBox icon={item.icon} active={active} />
      <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>
        {item.name}
      </span>
    </Link>
  );
}

function SidebarGroup({
  item,
  pathname,
  collapsed,
  isOpen,
  onToggle,
}: {
  item: NavItem & { children: NavChild[] };
  pathname: string;
  collapsed: boolean;
  isOpen: boolean;
  onToggle: (name: string) => void;
}) {
  const activeChildPath = getActiveChildPath(pathname, item.children);
  const groupActive = activeChildPath !== null;
  const expanded = isOpen && !collapsed;

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(item.name)}
        aria-expanded={expanded}
        aria-label={collapsed ? item.name : undefined}
        title={collapsed ? item.name : undefined}
        className={`${itemBase} ${itemTone(groupActive)} ${
          collapsed ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <IconBox icon={item.icon} active={groupActive} />
        <span
          className={`flex-1 truncate text-left ${collapsed ? "lg:hidden" : ""}`}
        >
          {item.name}
        </span>
        <ChevronDown
          className={`mr-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          } ${collapsed ? "lg:hidden" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity,visibility] duration-200 ${
          expanded
            ? "visible mt-1 grid-rows-[1fr] opacity-100"
            : "invisible grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-6 space-y-0.5 border-l border-slate-200/80 py-1 pl-3">
            {item.children.map((child) => {
              const active = child.path === activeChildPath;

              return (
                <Link
                  key={child.path}
                  href={child.path}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex items-center rounded-lg px-3 py-2 text-[13px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 ${
                    active
                      ? "bg-emerald-50 font-semibold text-emerald-800"
                      : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {active && (
                    <span className="absolute -left-[0.8rem] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-emerald-600" />
                  )}
                  <span className="truncate">{child.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(() =>
    findGroupForPath(pathname),
  );

  useEffect(() => {
    setMobileOpen(false);

    const activeGroup = findGroupForPath(pathname);
    if (activeGroup) setOpenGroup(activeGroup);
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, setMobileOpen]);

  const handleGroupToggle = (name: string) => {
    if (collapsed) {
      setCollapsed(false);
      setOpenGroup(name);
      return;
    }
    setOpenGroup((current) => (current === name ? null : name));
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-72 flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${
          mobileOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full shadow-none lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 px-4">
          <div className={collapsed ? "lg:mx-auto" : ""}>
            <Logo size="small" href="/admin/dashboard" showText={!collapsed} />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          className="scrollbar-hide flex-1 overflow-y-auto px-3 py-5"
        >
          <div className="space-y-5">
            {NAV_SECTIONS.map((section, index) => (
              <div key={section.title}>
                <h3
                  className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${
                    collapsed ? "lg:hidden" : ""
                  }`}
                >
                  {section.title}
                </h3>

                {collapsed && index > 0 && (
                  <div className="mx-3 mb-3 hidden h-px bg-slate-200/80 lg:block" />
                )}

                <div className="space-y-1">
                  {section.items.map((item) =>
                    item.children ? (
                      <SidebarGroup
                        key={item.name}
                        item={item as NavItem & { children: NavChild[] }}
                        pathname={pathname}
                        collapsed={collapsed}
                        isOpen={openGroup === item.name}
                        onToggle={handleGroupToggle}
                      />
                    ) : (
                      <SidebarLink
                        key={item.name}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                      />
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer: desktop collapse toggle */}
        <div className="shrink-0 border-t border-slate-200/80 p-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden w-full items-center rounded-xl py-2.5 text-slate-500 transition-all duration-150 hover:bg-slate-50 hover:text-emerald-700 lg:flex ${
              collapsed ? "justify-center px-0" : "gap-3 px-3"
            }`}
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-[18px] w-[18px]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider">
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