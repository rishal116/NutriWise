
import { Calendar, Clock, History, IndianRupee } from "lucide-react";

import type { PlanDto } from "@/dtos/nutritionist/plan/plan.dto";

interface PlanSidebarProps {
  plan: PlanDto;
}

export default function PlanSidebar({ plan }: PlanSidebarProps) {
  const createdAt = new Date(plan.createdAt);
  const updatedAt = new Date(plan.updatedAt);

  return (
    <div className="space-y-6">
      {/* Marketplace Pricing */}
      <section className="rounded-2xl bg-slate-900 p-8 text-white">
        <p className="mb-4 text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
          Marketplace Pricing
        </p>

        <div className="mb-8 flex items-baseline gap-2">
          <IndianRupee size={28} className="text-emerald-500" />

          <span className="text-5xl font-bold tracking-tight">
            {plan.price.toLocaleString("en-IN")}
          </span>

          <span className="text-xs font-bold text-slate-500">
            / plan
          </span>
        </div>

        <div className="space-y-3 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
              <Clock size={16} className="text-emerald-400" />
              Duration
            </div>

            <span className="font-bold text-emerald-50">
              {plan.durationDays} Days
            </span>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <Calendar size={14} />
              Listed Date
            </div>

            <span className="text-sm font-semibold">
              {createdAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Audit Trail */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          <History size={14} className="text-emerald-500" />
          Audit Trail
        </h3>

        <div className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-1 before:w-0.5 before:bg-slate-100">
          <div className="relative pl-6">
            <div className="absolute top-1 left-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />

            <p className="text-xs font-bold text-slate-800">
              Last Modified
            </p>

            <p className="text-[10px] font-semibold text-slate-400">
              {updatedAt.toLocaleTimeString("en-IN")} ·{" "}
              {updatedAt.toLocaleDateString("en-IN")}
            </p>
          </div>

          <div className="relative pl-6">
            <div className="absolute top-1 left-0 h-2.5 w-2.5 rounded-full bg-slate-200" />

            <p className="text-xs font-bold text-slate-400">
              Created Listing
            </p>

            <p className="text-[10px] font-semibold text-slate-300">
              {createdAt.toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
