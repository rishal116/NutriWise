import type {
  ProgramStatus,
  SubscriptionStatus,
} from "@/dtos/nutritionist/program/program-request.dto";

const PROGRAM_STATUS_STYLES: Record<ProgramStatus, string> = {
  upcoming: "bg-sky-50 text-sky-700 border-sky-100",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  paused: "bg-amber-50 text-amber-700 border-amber-100",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

const SUBSCRIPTION_STATUS_STYLES: Record<SubscriptionStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  active: "bg-emerald-50 text-emerald-700 border-emerald-100",
  expired: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100",
};

function BaseBadge({ label, className }: { label: string; className: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
}

export function ProgramStatusBadge({ status }: { status: ProgramStatus }) {
  return <BaseBadge label={status} className={PROGRAM_STATUS_STYLES[status]} />;
}

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  return (
    <BaseBadge label={status} className={SUBSCRIPTION_STATUS_STYLES[status]} />
  );
}
