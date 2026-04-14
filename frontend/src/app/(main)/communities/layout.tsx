"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";

const tabs = [
  { href: "/communities", label: "All" },
  { href: "/communities/groups", label: "Groups" },
  { href: "/communities/sessions", label: "Sessions" },
  { href: "/communities/posts", label: "Posts" },
  { href: "/communities/resources", label: "Resources" },
];

const stats = [
  { value: "4.8k", label: "Groups" },
  { value: "120", label: "Posts" },
  { value: "18", label: "Sessions" },
];

export default function CommunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4 sm:space-y-5">

      {/* Header shell */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[28px] bg-gradient-to-br from-emerald-500 via-teal-500 to-teal-600 px-5 sm:px-7 pt-5 sm:pt-7 pb-4 sm:pb-5">

        {/* Decorative blobs — matches nutritionists hero */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-52 w-52 rounded-full bg-emerald-400 opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-teal-400 opacity-20 blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 right-1/3 h-24 w-24 rounded-full bg-cyan-300 opacity-10 blur-xl" />

        {/* Top row: badge + title + stats */}
        <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-5 sm:mb-7">

          {/* Left: badge + title */}
          <div>
            {/* Badge — same style as nutritionists page */}
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wide text-white uppercase">
                Wellness platform
              </span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-bold leading-tight text-white">
              Community
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Connect, learn, and grow together
            </p>
          </div>

          {/* Right: stats */}
          <div className="flex items-stretch gap-4 sm:gap-6">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-stretch gap-4 sm:gap-6">
                {i > 0 && <div className="w-px bg-white/20" />}
                <div className="sm:text-right">
                  <p className="text-base sm:text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[10px] sm:text-[11px] text-emerald-100 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tab row */}
        <div className="relative -mx-5 sm:mx-0 px-5 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((t) => {
              const isActive =
                t.href === "/communities"
                  ? pathname === "/communities"
                  : pathname.startsWith(t.href);

              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`
                    flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full
                    text-[12px] sm:text-[13px] whitespace-nowrap transition-all border flex-shrink-0
                    ${isActive
                      ? "bg-white text-emerald-600 font-semibold border-white shadow-sm"
                      : "text-white/80 border-white/30 hover:text-white hover:bg-white/15 hover:border-white/50"
                    }
                  `}
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isActive ? "bg-emerald-500" : "bg-white/50"
                    }`}
                  />
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Content area */}
      <div className="rounded-2xl sm:rounded-[20px] border border-gray-100 bg-white px-4 sm:px-7 py-5 sm:py-6 shadow-sm">
        {children}
      </div>

    </div>
  );
}