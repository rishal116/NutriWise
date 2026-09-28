import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ProgramDetailsHeaderProps {
  title: string;
  nutritionistName: string;
  username: string;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed:
    "border-sky-200 bg-sky-50 text-sky-700",
  paused:
    "border-amber-200 bg-amber-50 text-amber-700",
  cancelled:
    "border-rose-200 bg-rose-50 text-rose-700",
  pending:
    "border-slate-200 bg-slate-100 text-slate-700",
};

function getStatusStyle(status: string): string {
  return (
    STATUS_STYLES[status.toLowerCase()] ??
    STATUS_STYLES.pending
  );
}

export default function ProgramDetailsHeader({
  title,
  nutritionistName,
  username,
  status,
}: ProgramDetailsHeaderProps) {
  return (
    <div>
      <Link
        href="/user/programs"
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Programs
      </Link>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">
                {nutritionistName}
              </p>

              <span className="text-xs font-medium text-slate-400">
                @{username}
              </span>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
              status,
            )}`}
          >
            {status}
          </span>
        </div>
      </section>
    </div>
  );
}