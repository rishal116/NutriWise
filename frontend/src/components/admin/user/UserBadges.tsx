import { CheckCircle2, Circle } from "lucide-react";

import { UserRole } from "@/enums/user/user.enum";

const ROLE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-violet-50 text-violet-600",
  [UserRole.NUTRITIONIST]: "bg-emerald-50 text-emerald-600",
  [UserRole.USER]: "bg-slate-100 text-slate-600",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-bold uppercase tracking-tight ${
        ROLE_STYLES[role] ?? ROLE_STYLES[UserRole.USER]
      }`}
    >
      {role}
    </span>
  );
}

export function ProfileStatus({ completed }: { completed: boolean }) {
  const Icon = completed ? CheckCircle2 : Circle;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        completed ? "text-emerald-600" : "text-slate-400"
      }`}
    >
      <Icon size={14} />
      {completed ? "Complete" : "Incomplete"}
    </span>
  );
}

export function AccountStatusBadge({ blocked }: { blocked: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
        blocked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          blocked ? "bg-red-600" : "bg-emerald-600"
        }`}
      />
      {blocked ? "Blocked" : "Active"}
    </span>
  );
}