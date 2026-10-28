"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  User,
  HeartPulse,
  Calendar,
  Video,
  Trophy,
  MessageCircle,
  CreditCard,
  Settings,
  X,
  FileText,
  Heart,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
  CalendarDays,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface ProfileSidebarProps {
  activePath: string;
  onClose?: () => void;
  collapsed?: boolean; // desktop only (lg+); mobile drawer is always expanded
  onToggle?: () => void;
}

const navSections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/user/profile", icon: User },
      { name: "Health Details", href: "/user/health", icon: HeartPulse },
    ],
  },
  {
    title: "My Journey",
    items: [
      { name: "My Programs", href: "/user/programs", icon: Calendar },
      { name: "My Challenges", href: "/user/challenges", icon: Trophy },
      { name: "Meetings", href: "/user/meetings", icon: Video },
      {
        name: "Sessions",
        href: "/user/sessions",
        icon: CalendarDays,
      },
      { name: "Progress", href: "/user/progress", icon: BarChart3 },
    ],
  },
  {
    title: "Community",
    items: [
      { name: "My Posts", href: "/user/posts", icon: FileText },
      { name: "Liked Posts", href: "/user/liked-posts", icon: Heart },
      { name: "Messages", href: "/user/messages", icon: MessageCircle },
    ],
  },
  {
    title: "Billing & Settings",
    items: [
      { name: "Payments", href: "/user/payments", icon: CreditCard },
      { name: "Settings", href: "/user/settings", icon: Settings },
    ],
  },
];

const isActive = (path: string, href: string) =>
  path === href || path.startsWith(`${href}/`);

export default function ProfileSidebar({
  activePath,
  onClose,
  collapsed = false,
  onToggle,
}: ProfileSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Mobile header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4 lg:hidden">
        <span className="text-sm font-semibold text-slate-900">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          collapsed ? "lg:px-2" : ""
        }`}
        aria-label="Profile menu"
      >
        {navSections.map((section, i) => (
          <div key={section.title} className={i ? "mt-5" : ""}>
            {i > 0 && collapsed && (
              <hr className="mb-4 hidden border-slate-100 lg:block" />
            )}
            <p
              className={`mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {section.title}
            </p>
            <ul className="flex flex-col gap-0.5">
              {section.items.map(({ name, href, icon: Icon }) => {
                const active = isActive(activePath, href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      title={collapsed ? name : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                        collapsed ? "lg:justify-center lg:px-0" : ""
                      } ${
                        active
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span
                        className={`truncate text-sm font-medium ${
                          collapsed ? "lg:sr-only" : ""
                        }`}
                      >
                        {name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden shrink-0 border-t border-slate-100 p-3 lg:block">
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          title={collapsed ? "Expand sidebar" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronsLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
