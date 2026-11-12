import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";

interface CreatePlanDayHeaderProps {
  planId: string;
}

export default function CreatePlanDayHeader({
  planId,
}: CreatePlanDayHeaderProps) {
  return (
    <div className="space-y-5">
      <Link
        href={`/nutritionist/plans/${planId}/days`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
      >
        <ArrowLeft size={16} />
        Back to plan days
      </Link>

      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          <CalendarPlus size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Create Plan Day
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Build a day in your reusable nutrition plan template.
          </p>
        </div>
      </div>
    </div>
  );
}
