import type { LucideIcon } from "lucide-react";

interface SessionInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export default function SessionInfoCard({
  icon: Icon,
  label,
  value,
}: SessionInfoCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 transition hover:border-emerald-200 hover:shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <Icon className="h-[18px] w-[18px]" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}
