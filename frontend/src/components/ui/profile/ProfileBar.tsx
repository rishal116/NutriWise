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
  BookOpen,
  CreditCard,
  Settings,
  X,
  type LucideIcon,
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
  compact?: boolean;
  activePath: string;
  onClose?: () => void;
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
      { name: "My Plan", href: "/user/plans", icon: Calendar },
      { name: "Meetings", href: "/user/meetings", icon: Video },
      { name: "Progress", href: "/user/progress", icon: Trophy },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Messages", href: "/user/messages", icon: MessageCircle },
      { name: "Resources", href: "/user/resources", icon: BookOpen },
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

export default function ProfileSidebar({
  compact = false,
  activePath,
  onClose,
}: ProfileSidebarProps) {
  return (
    <aside
      className={`h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out ${
        compact ? "w-16" : "w-56"
      }`}
    >
      {/* Mobile close row — only on small screens, only in full mode */}
      {!compact && (
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav
        className={`flex-1 overflow-y-auto py-4 ${compact ? "px-2" : "px-3"}`}
      >
        {navSections.map((section, si) => (
          <div key={section.title} className={si !== 0 ? "mt-5" : ""}>
            {!compact && (
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {section.title}
              </p>
            )}

            <div
              className={`flex flex-col gap-0.5 ${compact ? "items-center" : ""}`}
            >
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePath.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    title={compact ? item.name : undefined}
                    className={`flex items-center transition-all duration-150 rounded-lg ${
                      compact
                        ? "justify-center w-10 h-10 mx-auto"
                        : "gap-2.5 px-3 py-2 w-full"
                    } ${
                      isActive
                        ? "bg-emerald-600 text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!compact && (
                      <span className="text-sm font-medium truncate">
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
