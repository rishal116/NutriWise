
import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";

interface DashboardKpiGridProps {
  dashboard: NutriDashboardOverviewDTO;
}

interface KpiCardConfig {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
}

function KpiCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: KpiCardConfig) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBackgroundClassName}`}
        >
          <Icon size={20} className={iconClassName} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardKpiGrid({
  dashboard,
}: DashboardKpiGridProps) {
  const totalPrograms = Object.values(dashboard.programs).reduce(
    (total, count) => total + count,
    0,
  );

  const cards: KpiCardConfig[] = [
    {
      label: "Total clients",
      value: dashboard.clients.total,
      helper: `${dashboard.clients.active} active clients`,
      icon: Users,
      iconClassName: "text-emerald-600",
      iconBackgroundClassName: "bg-emerald-50",
    },
    {
      label: "Programs",
      value: totalPrograms,
      helper: `${dashboard.programs.active} active`,
      icon: BriefcaseBusiness,
      iconClassName: "text-violet-600",
      iconBackgroundClassName: "bg-violet-50",
    },
    {
      label: "Published plans",
      value: dashboard.plans.published,
      helper: `${dashboard.plans.draft} drafts`,
      icon: BookOpen,
      iconClassName: "text-indigo-600",
      iconBackgroundClassName: "bg-indigo-50",
    },
    {
      label: "Resources",
      value: dashboard.resources.total,
      helper: `${dashboard.resources.published} published`,
      icon: FileText,
      iconClassName: "text-amber-600",
      iconBackgroundClassName: "bg-amber-50",
    },
    {
      label: "Groups",
      value: dashboard.groups.total,
      helper: `${dashboard.groups.active} active`,
      icon: UsersRound,
      iconClassName: "text-rose-600",
      iconBackgroundClassName: "bg-rose-50",
    },
  ];

  return (
    <section
      aria-label="Practice statistics"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5"
    >
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </section>
  );
}
