
import type { ReactNode } from "react";

interface ProfileFieldLabelProps {
  icon?: ReactNode;
  children: ReactNode;
  required?: boolean;
}

export function ProfileFieldLabel({
  icon,
  children,
  required,
}: ProfileFieldLabelProps) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      {icon}
      {children}
      {required && <span className="ml-0.5 text-rose-500">*</span>}
    </label>
  );
}
