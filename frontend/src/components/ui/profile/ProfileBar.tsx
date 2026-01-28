"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

/* -------- TYPES -------- */
type Role = "user" | "nutritionist" | "admin";

interface NavItem {
  name: string;
  href: string;
  icon: any;
  roles?: Role[];
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

/* -------- NAV CONFIG -------- */
const navSections: NavSection[] = [
  {
    title: "Account",
    items: [
      { name: "Profile", href: "/profile", icon: User },
      { name: "Health Details", href: "/health", icon: HeartPulse },
    ],
  },
  {
    title: "My Journey",
    items: [
      { name: "My Plan", href: "/plans", icon: Calendar },
      { name: "Tasks", href: "/tasks", icon: ClipboardList },
      { name: "Meetings", href: "/meetings", icon: Video },
      { name: "Progress", href: "/progress", icon: Trophy },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Messages", href: "/messages", icon: MessageCircle, badge: 2 },
      { name: "Resources", href: "/resources", icon: BookOpen },
    ],
  },
  {
    title: "Billing & Settings",
    items: [
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/* -------- COMPONENT -------- */
export default function ProfileSidebar({
  role = "user",
}: {
  role?: Role;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full border-r border-gray-200 bg-gradient-to-b from-white to-gray-50 px-5 py-8 space-y-8 shadow-lg">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2">
            {section.title}
          </p>

          <div className="space-y-1.5">
            {section.items
              .filter(
                (item) => !item.roles || item.roles.includes(role)
              )
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200 ease-in-out relative overflow-hidden group
                      ${
                        isActive
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md scale-105"
                          : "text-gray-700 hover:bg-gray-100 hover:shadow-sm hover:scale-102"
                      }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />

                    <span className="flex-1">{item.name}</span>

                    {item.badge && (
                      <span className="text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/10 to-green-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                    )}
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </aside>
  );
}