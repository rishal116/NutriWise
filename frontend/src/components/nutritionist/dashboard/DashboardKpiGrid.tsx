import {
  BookOpen,
  BriefcaseBusiness,
  FileText,
  Users,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardSummary {
  totalClients: number;
  activeClients: number;
  totalPrograms: number;
  activePrograms: number;
  publishedPlans: number;
  totalPlanPurchases: number;
  totalGroups: number;
  publishedResources: number;
}

interface DashboardKpiGridProps {
  summary: DashboardSummary;
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
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-1 text-xs text-slate-400">{helper}</p>
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

export default function DashboardKpiGrid({ summary }: DashboardKpiGridProps) {
  const cards: KpiCardConfig[] = [
    {
      label: "Total clients",
      value: summary.totalClients,
      helper: "Clients in active coaching",
      icon: Users,
      iconClassName: "text-emerald-600",
      iconBackgroundClassName: "bg-emerald-50",
    },
    {
      label: "Active clients",
      value: summary.activeClients,
      helper: "Currently progressing",
      icon: UserRoundCheck,
      iconClassName: "text-blue-600",
      iconBackgroundClassName: "bg-blue-50",
    },
    {
      label: "Programs",
      value: summary.totalPrograms,
      helper: `${summary.activePrograms} active`,
      icon: BriefcaseBusiness,
      iconClassName: "text-violet-600",
      iconBackgroundClassName: "bg-violet-50",
    },
    {
      label: "Plan purchases",
      value: summary.totalPlanPurchases,
      helper: "Successful coaching purchases",
      icon: FileText,
      iconClassName: "text-amber-600",
      iconBackgroundClassName: "bg-amber-50",
    },
    {
      label: "Published plans",
      value: summary.publishedPlans,
      helper: "Plans currently visible",
      icon: BookOpen,
      iconClassName: "text-indigo-600",
      iconBackgroundClassName: "bg-indigo-50",
    },
    {
      label: "Groups",
      value: summary.totalGroups,
      helper: "Active coaching groups",
      icon: UsersRound,
      iconClassName: "text-rose-600",
      iconBackgroundClassName: "bg-rose-50",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </section>
  );
}
