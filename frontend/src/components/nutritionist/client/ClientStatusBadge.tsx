import type { ProgramStatus } from "@/dtos/nutritionist/client/client-response.dto";

interface ClientStatusBadgeProps {
  status: ProgramStatus;
}

const STATUS_STYLES: Record<ProgramStatus, string> = {
  upcoming: "border-sky-200 bg-sky-50 text-sky-700",
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  paused: "border-amber-200 bg-amber-50 text-amber-700",
  completed: "border-slate-200 bg-slate-100 text-slate-600",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function ClientStatusBadge({
  status,
}: ClientStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize tracking-wide ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}