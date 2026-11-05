import type { ReactNode } from "react";

interface ProfileInfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export function ProfileInfoRow({ icon, label, value }: ProfileInfoRowProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3">
      <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-1.5">{icon}</div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
