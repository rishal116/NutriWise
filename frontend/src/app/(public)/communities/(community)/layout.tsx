"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { href: "/communities/groups", label: "Groups" },
  { href: "/communities/sessions", label: "Sessions" },
  { href: "/communities/posts", label: "Posts" },
  { href: "/communities/resources", label: "Resources" },
];

interface CommunitiesLayoutProps {
  children: ReactNode;
}

export default function CommunitiesLayout({
  children,
}: CommunitiesLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:space-y-5 sm:px-6 sm:py-10">
      <header className="relative overflow-hidden rounded-2xl bg-emerald-900 px-5 pb-5 pt-5 sm:rounded-[28px] sm:px-7 sm:pb-6 sm:pt-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-600 opacity-20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-emerald-700 opacity-20 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-1/3 top-1/2 h-24 w-24 rounded-full bg-emerald-500 opacity-10 blur-xl"
        />

        <div className="relative mb-5 sm:mb-7">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/15 px-3 py-1 backdrop-blur-sm">
            <TrendingUp
              aria-hidden="true"
              className="h-3 w-3 text-emerald-300"
            />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white sm:text-[11px]">
              Wellness platform
            </span>
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-[26px]">
            Community
          </h1>

          <p className="mt-1 text-xs font-medium text-emerald-200/90 sm:text-sm">
            Connect, learn, and grow together
          </p>
        </div>

        <nav
          aria-label="Community navigation"
          className="relative -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors duration-150 sm:px-4 sm:text-[13px] ${
                    isActive
                      ? "border-white bg-white font-semibold text-emerald-700 shadow-xs"
                      : "border-white/20 text-emerald-100 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isActive ? "bg-emerald-600" : "bg-white/50"
                    }`}
                  />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-xs sm:rounded-[20px] sm:px-7 sm:py-6">
        {children}
      </main>
    </div>
  );
}
