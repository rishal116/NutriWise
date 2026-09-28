import { ArrowUpRight, Users } from "lucide-react";
import Link from "next/link";

interface DashboardClientOverviewProps {
  totalClients: number;
  activeClients: number;
}

export default function DashboardClientOverview({
  totalClients,
  activeClients,
}: DashboardClientOverviewProps) {
  const activePercentage =
    totalClients > 0
      ? Math.min(100, Math.round((activeClients / totalClients) * 100))
      : 0;

  return (
    <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Users size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Client overview
              </h2>

              <p className="text-xs text-slate-400">
                Current coaching engagement
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/nutritionist/clients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
        >
          View clients
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              {activeClients.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              of {totalClients.toLocaleString("en-IN")} clients active
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
            {activePercentage}%
          </span>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${activePercentage}%` }}
          />
        </div>

        {totalClients === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              No clients yet
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Your client activity will appear here as people begin coaching
              with you.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-lg font-bold text-slate-900">
                {totalClients - activeClients}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Inactive clients
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
              <p className="text-lg font-bold text-emerald-700">
                {activeClients}
              </p>

              <p className="mt-1 text-xs text-emerald-700/70">
                Active clients
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}