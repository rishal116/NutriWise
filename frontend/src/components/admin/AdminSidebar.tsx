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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  BookOpen,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

interface NavChild {
  name: string;
  path: string;
}

type NavItem =
  | {
      name: string;
      icon: LucideIcon;
      path: string;
      children?: never;
    }
  | {
      name: string;
      icon: LucideIcon;
      children: NavChild[];
      path?: never;
    };

interface NavSection {
  title: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
      },
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
    items: [
      { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    ],
  },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const NAV_ITEM_CLASS = `group relative flex w-full items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors duration-200 ${FOCUS_RING}`;

const ICON_BUTTON_CLASS = `flex h-9 w-9 items-center justify-center rounded-xl text-admin-muted transition-colors hover:bg-admin-accent/10 hover:text-admin-accent ${FOCUS_RING}`;

function getItemClass(isActive: boolean, collapsed: boolean): string {
  const state = isActive
    ? "bg-admin-accent/10 text-admin-accent"
    : "text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text";

  return `${NAV_ITEM_CLASS} ${state} ${
    collapsed ? "lg:justify-center lg:px-0" : ""
  }`;
}

function isPathActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function getActiveChildPath(
  pathname: string,
  children: NavChild[],
): string | null {
  const activeChild = children
    .filter((child) => isPathActive(pathname, child.path))
    .sort((first, second) => second.path.length - first.path.length)[0];

  return activeChild?.path ?? null;
}

function getActiveGroup(pathname: string): string | null {
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (item.children && getActiveChildPath(pathname, item.children)) {
        return item.name;
      }
    }
  }

  return null;
}

function NavIcon({
  icon: Icon,
  active,
}: {
  icon: LucideIcon;
  active: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
        active
          ? "bg-admin-accent/15 text-admin-accent"
          : "group-hover:bg-admin-accent/10 group-hover:text-admin-accent"
      }`}
    >
      <Icon size={19} strokeWidth={1.8} />
    </span>
  );
}

function SidebarLink({
  item,
  pathname,
  collapsed,
}: {
  item: Extract<NavItem, { path: string }>;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive = isPathActive(pathname, item.path);

  return (
    <Link
      href={item.path}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.name : undefined}
      className={getItemClass(isActive, collapsed)}
    >
      {isActive && (
        <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-admin-accent" />
      )}

      <NavIcon icon={item.icon} active={isActive} />

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
  isExpanded,
  onToggle,
}: {
  item: Extract<NavItem, { children: NavChild[] }>;
  pathname: string;
  collapsed: boolean;
  isExpanded: boolean;
  onToggle: (name: string) => void;
}) {
  const activeChildPath = getActiveChildPath(pathname, item.children);
  const isActive = activeChildPath !== null;
  const isOpen = isExpanded && !collapsed;

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(item.name)}
        aria-expanded={isOpen}
        title={collapsed ? item.name : undefined}
        className={getItemClass(isActive, collapsed)}
      >
        {isActive && (
          <span className="absolute -left-3 bottom-2 top-2 w-1 rounded-r-full bg-admin-accent" />
        )}

        <NavIcon icon={item.icon} active={isActive} />

        <span
          className={`flex-1 truncate text-left ${
            collapsed ? "lg:hidden" : ""
          }`}
        >
          {item.name}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-admin-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${collapsed ? "lg:hidden" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ${
          isOpen
            ? "mt-1 grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-6 space-y-1 border-l border-admin-border py-1 pl-3">
            {item.children.map((child) => {
              const isChildActive = child.path === activeChildPath;

              return (
                <Link
                  key={child.path}
                  href={child.path}
                  tabIndex={isOpen ? undefined : -1}
                  aria-current={isChildActive ? "page" : undefined}
                  className={`block truncate rounded-lg px-3 py-2 text-[13px] transition-colors ${FOCUS_RING} ${
                    isChildActive
                      ? "bg-admin-accent/10 font-semibold text-admin-accent"
                      : "font-medium text-admin-muted hover:bg-admin-surface-hover hover:text-admin-text"
                  }`}
                >
                  {child.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [expandedGroup, setExpandedGroup] = useState<string | null>(() =>
    getActiveGroup(pathname),
  );

  useEffect(() => {
    setMobileOpen(false);

    const activeGroup = getActiveGroup(pathname);

    if (activeGroup) {
      setExpandedGroup(activeGroup);
    }
  }, [pathname, setMobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, setMobileOpen]);

  const handleGroupToggle = (groupName: string) => {
    if (collapsed) {
      setCollapsed(false);
      setExpandedGroup(groupName);
      return;
    }

    setExpandedGroup((currentGroup) =>
      currentGroup === groupName ? null : groupName,
    );
  };

  // Also closes the drawer when the link points to the current route
  // (pathname does not change in that case).
  const handleNavClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        aria-label="Admin sidebar"
        className={`fixed bottom-0 left-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-72 flex-col border-r border-admin-border bg-admin-surface shadow-xl transition-[transform,width,visibility] duration-300 ease-in-out lg:visible lg:sticky lg:top-16 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          collapsed ? "lg:w-19" : "lg:w-64"
        } ${mobileOpen ? "visible translate-x-0" : "invisible -translate-x-full"}`}
      >
        {/* Top bar */}
        <div
          className={`flex h-14 shrink-0 items-center border-b border-admin-border px-3 ${
            collapsed ? "lg:justify-center" : "justify-between"
          }`}
        >
          <span
            className={`px-2 text-xs font-semibold uppercase tracking-wider text-admin-muted ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            Navigation
          </span>

          {/* Desktop collapse */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden lg:flex ${ICON_BUTTON_CLASS}`}
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <ChevronLeft size={19} />
            )}
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className={`lg:hidden ${ICON_BUTTON_CLASS}`}
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Admin navigation"
          onClick={handleNavClick}
          className="flex-1 space-y-6 overflow-y-auto px-3 py-5"
        >
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3
                className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-admin-muted ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  if (item.children) {
                    return (
                      <SidebarGroup
                        key={item.name}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                        isExpanded={expandedGroup === item.name}
                        onToggle={handleGroupToggle}
                      />
                    );
                  }

                  return (
                    <SidebarLink
                      key={item.name}
                      item={item}
                      pathname={pathname}
                      collapsed={collapsed}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}