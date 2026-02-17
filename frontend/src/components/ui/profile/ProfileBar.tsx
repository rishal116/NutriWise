"use client";

import Link from "next/link";
import {
  User, HeartPulse, Calendar, ClipboardList, Video, 
  Trophy, MessageCircle, BookOpen, CreditCard, Settings, X,
} from "lucide-react";



interface NavItem {
  name: string;
  href: string;
  icon: any;
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
      { name: "Profile", href: "/client/profile", icon: User },
      { name: "Health Details", href: "/client/health", icon: HeartPulse },
    ],
  },
  {
    title: "My Journey",
    items: [
      { name: "My Plan", href: "/client/plans", icon: Calendar },
      { name: "Tasks", href: "/client/tasks", icon: ClipboardList },
      { name: "Meetings", href: "/client/meetings", icon: Video },
      { name: "Progress", href: "/client/progress", icon: Trophy },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Messages", href: "/client/messages", icon: MessageCircle },
      { name: "Resources", href: "/client/resources", icon: BookOpen },
    ],
  },
  {
    title: "Billing & Settings",
    items: [
      { name: "Payments", href: "/client/payments", icon: CreditCard },
      { name: "Settings", href: "/client/settings", icon: Settings },
    ],
  },
];




export default function ProfileSidebar({
  compact = false,
  activePath,
  onClose,
  disableScroll,
}: ProfileSidebarProps) {
  return (
    <aside
      className={`
        h-full bg-white transition-all duration-300 ease-in-out flex flex-col
        ${compact ? "w-20" : "w-64"}
      `}
    >
      {/* Mobile Close Button */}
      {!compact && (
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-50">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Menu</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

<nav
  className={`
    flex-1 py-6
    ${disableScroll ? "overflow-hidden" : "overflow-y-auto"} // Use overflow-hidden to hide scrollbar
    ${compact ? "px-3" : "px-4"}
  `}
>

        {navSections.map((section) => (
          <div key={section.title} className={`w-full ${compact ? "mb-2" : "mb-6"}`}>
            {!compact && (
              <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400/80">
                {section.title}
              </h3>
            )}

            <div className={`flex flex-col gap-1 ${compact ? "items-center" : ""}`}>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePath.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    title={compact ? item.name : ""} 
                    className={`
                      relative flex items-center group transition-all duration-200
                      ${compact 
                        ? "justify-center h-12 w-12 rounded-xl" 
                        : "gap-3 px-4 py-3 rounded-xl w-full"}
                      ${isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                        : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"}
                    `}
                  >
                    <Icon className={`${compact ? "w-6 h-6" : "w-5 h-5"} shrink-0`} />

                    {!compact && (
                      <span className="text-sm font-semibold tracking-tight">
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