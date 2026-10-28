"use client";

import Link from "next/link";
import { ArrowRight, HeartPulse } from "lucide-react";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-teal-100/50 blur-3xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm ring-1 ring-emerald-100">
            <HeartPulse className="h-4 w-4" />
            Your health journey
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your wellness dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Review your coaching programs, keep up with daily activities, and
            see how your health journey is progressing.
          </p>

          <p className="mt-4 text-sm font-medium text-slate-500">
            {new Intl.DateTimeFormat("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>

        <Link
          href="/coaching"
          className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
        >
          Explore coaching
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}