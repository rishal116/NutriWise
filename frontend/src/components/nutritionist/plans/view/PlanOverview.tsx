
import { Tag } from "lucide-react";

import type { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";

interface PlanOverviewProps {
  plan: PlanDto;
}

export default function PlanOverview({ plan }: PlanOverviewProps) {
  const statusStyles = {
    draft: "border-slate-200 bg-slate-50 text-slate-600",
    published: "border-emerald-100 bg-emerald-50 text-emerald-600",
    archived: "border-amber-100 bg-amber-50 text-amber-600",
  } as const;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-lg border px-4 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[plan.status]}`}
        >
          {plan.status}
        </span>

        <span className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          <Tag size={12} className="text-emerald-500" />
          {plan.specialization.replace(/_/g, " ")}
        </span>
      </div>

      <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-slate-900 md:text-5xl">
        {plan.title}
      </h1>

      <p className="text-lg leading-relaxed font-medium text-slate-600">
        {plan.description ||
          "No detailed description provided for this plan."}
      </p>
    </section>
  );
}
