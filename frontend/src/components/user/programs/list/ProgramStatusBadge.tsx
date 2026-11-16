import type { ProgramStatus } from "@/constants/user/program/program-status.constants";

const PROGRAM_STATUS_STYLES: Record<ProgramStatus, string> = {
  preparing: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ready: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-slate-100 text-slate-700 ring-slate-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

interface BadgeProps {
  label: string;
  className: string;
}

function Badge({ label, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}

interface ProgramStatusBadgeProps {
  status: ProgramStatus;
}

export function ProgramStatusBadge({ status }: ProgramStatusBadgeProps) {
  return <Badge label={status} className={PROGRAM_STATUS_STYLES[status]} />;
}
