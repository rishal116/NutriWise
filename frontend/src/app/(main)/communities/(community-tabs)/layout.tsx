"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Calendar, Layout, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/communities/groups", label: "Groups", icon: Users },
  { href: "/communities/sessions", label: "Sessions", icon: Calendar },
  { href: "/communities/posts", label: "Posts", icon: Layout },
  { href: "/communities/resources", label: "Resources", icon: FolderOpen },
];

export default function CommunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white pt-12 pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              NutriWise Community
            </h1>
            <p className="text-emerald-100/90 text-lg max-w-2xl">
              Connect with fellow health enthusiasts, join expert-led sessions, and access premium nutrition resources.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation and Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 pb-12">
        <div className="relative">
          {/* Glassmorphism Navigation */}
          <div className="sticky top-4 z-40 mb-8 p-1.5 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              const Icon = tab.icon;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="relative flex-1 min-w-[120px]"
                >
                  <div
                    className={`relative z-10 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-xl ${
                      isActive ? "text-emerald-700" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-gray-400"}`} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-emerald-50 border border-emerald-100 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Child Page Container */}
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}