import { ProgramStatus, SubscriptionStatus } from "@/dtos/user/program/user-program-request.dto";

const PROGRAM_STATUS_STYLES: Record<ProgramStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 ring-blue-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  paused: "bg-amber-50 text-amber-700 ring-amber-600/20",
  completed: "bg-slate-100 text-slate-700 ring-slate-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const SUBSCRIPTION_STATUS_STYLES: Record<SubscriptionStatus, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  expired: "bg-slate-100 text-slate-700 ring-slate-600/20",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

function Badge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}

export function ProgramStatusBadge({ status }: { status: ProgramStatus }) {
  return <Badge label={status} className={PROGRAM_STATUS_STYLES[status]} />;
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  return <Badge label={status} className={SUBSCRIPTION_STATUS_STYLES[status]} />;
}