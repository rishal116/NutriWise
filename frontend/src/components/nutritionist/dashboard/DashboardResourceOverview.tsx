import {
  ArrowUpRight,
  Download,
  Eye,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface DashboardResources {
  published: number;
  totalViews: number;
  totalDownloads: number;
}

interface DashboardResourceOverviewProps {
  resources: DashboardResources;
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Icon size={15} className="text-slate-400" />

        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
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
              Resource performance
            </h2>

            <p className="text-xs text-slate-400">
              How your published resources are performing
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
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              {resources.published.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              published resources
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Metric
            icon={Eye}
            label="Total views"
            value={resources.totalViews}
          />

          <Metric
            icon={Download}
            label="Downloads"
            value={resources.totalDownloads}
          />
        </div>

        {resources.published === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700">
              No published resources
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Publish your first educational resource to start tracking
              engagement.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}