import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

import type { NutriDashboardOverviewDTO } from "@/dtos/nutritionist/dashboard/nutri-dashboard-response.dto";

interface DashboardResourceOverviewProps {
  resources: NutriDashboardOverviewDTO["resources"];
}

export default function DashboardResourceOverview({
  resources,
}: DashboardResourceOverviewProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <FileText size={19} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Resource overview
            </h2>
            <p className="text-xs text-slate-400">
              Your educational content
            </p>
          </div>
        </div>

        <Link
          href="/nutritionist/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Resources
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="mt-7">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-2xl font-bold text-slate-900">
              {resources.total.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Total resources
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-2xl font-bold text-emerald-700">
              {resources.published.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-700/70">
              Published
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-lg font-bold text-slate-900">
            {resources.draft.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Draft resources
          </p>
        </div>

        {resources.published === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700">
              No published resources
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Publish your first educational resource to make it available to
              your audience.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}