import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

const PROGRAM_STATUS_STYLES: Record<ProgramStatus, string> = {
  preparing: "border-violet-100 bg-violet-50 text-violet-700",
  ready: "border-indigo-100 bg-indigo-50 text-indigo-700",
  upcoming: "border-sky-100 bg-sky-50 text-sky-700",
  active: "border-emerald-100 bg-emerald-50 text-emerald-700",
  paused: "border-amber-100 bg-amber-50 text-amber-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-rose-100 bg-rose-50 text-rose-700",
};

interface BaseBadgeProps {
  label: string;
  className: string;
}

function BaseBadge({ label, className }: BaseBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {label.replace(/_/g, " ")}
    </span>
  );
}

interface ProgramStatusBadgeProps {
  status: ProgramStatus;
}

export function ProgramStatusBadge({ status }: ProgramStatusBadgeProps) {
  return <BaseBadge label={status} className={PROGRAM_STATUS_STYLES[status]} />;
}
