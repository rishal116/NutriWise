"use client";

import {
  CalendarDays,
  CreditCard,
  HeartPulse,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { UserDashboardOverviewDTO } from "@/dtos/user/dashboard/user-dashboard-overview.dto";

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </section>
  );
}

export default function DashboardStats({
  overview,
}: {
  overview: UserDashboardOverviewDTO;
}) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Active programs"
        value={overview.activePrograms}
        description={`${overview.totalPrograms} total coaching programs`}
        icon={HeartPulse}
      />
      <StatCard
        label="Active challenges"
        value={overview.activeChallenges}
        description={`${overview.completedChallenges} challenges completed`}
        icon={Trophy}
      />
      <StatCard
        label="Upcoming consultations"
        value={overview.upcomingConsultations}
        description="Scheduled coaching meetings"
        icon={CalendarDays}
      />
      <StatCard
        label="Unread notifications"
        value={overview.unreadNotifications}
        description="Updates waiting for your attention"
        icon={CreditCard}
      />
    </section>
  );
}