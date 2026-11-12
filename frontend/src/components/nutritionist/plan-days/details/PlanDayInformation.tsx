import { CalendarClock, FileText } from "lucide-react";

interface PlanDayInformationProps {
  title?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

function formatDate(value: Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PlanDayInformation({
  title,
  description,
  createdAt,
  updatedAt,
}: PlanDayInformationProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="h-5 w-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Day information
        </h2>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Title
          </p>

          <p className="mt-1 text-base font-semibold text-slate-800">
            {title?.trim() || "Untitled day"}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Description
          </p>

          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {description?.trim() || "No description provided."}
          </p>
        </div>

        <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">
                Created
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatDate(createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-4 w-4 text-slate-400" />
            <div>
              <p className="text-xs font-medium text-slate-400">
                Last updated
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                {formatDate(updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}