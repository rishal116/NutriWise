"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Icons (lucide-react)
import {
  User,
  HeartPulse,
  Calendar,
  CreditCard,
  MessageCircle,
  BookOpen,
  Trophy,
  FileText,
  Video,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Personal Info", href: "/profile", icon: User },
  { name: "Health Details", href: "/health", icon: HeartPulse },
  { name: "Appointments", href: "/appointments", icon: Calendar },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Messages", href: "/messages", icon: MessageCircle },
  { name: "Resources", href: "/resources", icon: BookOpen },
  { name: "Challenges", href: "/challenges", icon: Trophy },
  { name: "Posts", href: "/posts", icon: FileText },
  { name: "Sessions", href: "/sessions", icon: Video },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function ProfileBar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r h-full p-6 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                ${
                  active
                    ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
          >
            <Icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
