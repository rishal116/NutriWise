"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  User,
  HeartPulse,
  Calendar,
  ClipboardList,
  Video,
  Trophy,
  MessageCircle,
  BookOpen,
  CreditCard,
  Settings,
  X,
} from "lucide-react";
import SidebarTooltip from "@/components/ui/profile/SidebarTooltip";
interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface ProfileSidebarProps {
  compact?: boolean;
  activePath: string;
  onClose?: () => void;
  disableScroll?: boolean;
}

const navSections: NavSection[] = [
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/account/profile", icon: User },
      { name: "Health Details", href: "/account/health", icon: HeartPulse },
    ],
  },
  {
    title: "My Journey",
    items: [
      { name: "My Plan", href: "/account/plans", icon: Calendar },
      { name: "Tasks", href: "/account/tasks", icon: ClipboardList },
      { name: "Meetings", href: "/account/meetings", icon: Video },
      { name: "Progress", href: "/account/progress", icon: Trophy },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Messages", href: "/account/messages", icon: MessageCircle },
      { name: "Resources", href: "/account/resources", icon: BookOpen },
    ],
  },
  {
    title: "Billing & Settings",
    items: [
      { name: "Payments", href: "/account/payments", icon: CreditCard },
      { name: "Settings", href: "/account/settings", icon: Settings },
    ],
  },
];

export default function ProfileSidebar({
  compact = false,
  activePath,
  onClose,
  disableScroll
}: ProfileSidebarProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
const [hovered, setHovered] = useState(false);
  return (
    <aside
      className={`h-full border-r bg-white lg:bg-gradient-to-b lg:from-white lg:to-gray-50 shadow-lg transition-all duration-300
        ${compact ? "w-20" : "w-72 sm:w-80 lg:w-64"}
      `}
    >
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🍃</span>
          </div>
          <span className="text-lg font-bold text-gray-900">Menu</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        )}
      </div>

      {/* Scroll Container */}
      <div
  className={`
    h-full
    ${disableScroll ? "" : "overflow-y-auto"}
    ${compact ? "px-2 py-4" : "px-4 sm:px-5 py-6"}
  `}
>
        <div className={compact ? "space-y-2" : "space-y-6 sm:space-y-8"}>
          {navSections.map((section) => (
            <div key={section.title}>
              {/* Section Title */}
              {!compact && (
                <p className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">
                  {section.title}
                </p>
              )}

              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePath.startsWith(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      title={compact ? item.name : undefined}
                      className={`flex items-center rounded-xl transition-all duration-200 relative group
                        ${compact ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"}
                        ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md"
                            : "text-gray-700 hover:bg-gray-100 hover:text-emerald-600"
                        }
                      `}
                    >
                      <Icon className={`${compact ? "w-5 h-5" : "w-5 h-5 flex-shrink-0"}`} />

                      {!compact && (
                        <span className="flex-1 text-sm font-medium">
                          {item.name}
                        </span>
                      )}

                      {/* Badge */}
                      {!compact && item.badge && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for compact mode */}
{compact && (
  <span
    className="
      pointer-events-none
      absolute left-full top-1/2 -translate-y-1/2
      ml-3
      px-4 py-2
      rounded-lg
      text-sm font-medium
      bg-[#202c33]
      text-white
      shadow-xl
      opacity-0 scale-95
      group-hover:opacity-100
      group-hover:scale-100
      transition-all duration-200 ease-out
      whitespace-nowrap
      z-50
    "
  >
    {item.name}

    {/* Small Arrow */}
    <span
      className="
        absolute left-[-6px] top-1/2 -translate-y-1/2
        w-3 h-3
        bg-[#202c33]
        rotate-45
      "
    />
  </span>
)}

                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}