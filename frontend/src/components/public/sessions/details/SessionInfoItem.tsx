
import type { ReactNode } from "react";

interface SessionInfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function SessionInfoItem({
  icon,
  label,
  value,
}: SessionInfoItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
      <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
