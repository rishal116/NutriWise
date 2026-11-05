import { CheckCircle2, Circle } from "lucide-react";

import { UserRole } from "@/enums/user/user.enum";

const ROLE_STYLES: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-admin-pastel-purple text-admin-text",
  [UserRole.NUTRITIONIST]: "bg-admin-accent-soft text-admin-accent",
  [UserRole.USER]: "bg-admin-surface-hover text-admin-muted",
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
        completed ? "text-admin-success" : "text-admin-muted"
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
        blocked
          ? "bg-admin-danger-soft text-admin-danger"
          : "bg-admin-pastel-green text-admin-success"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          blocked ? "bg-admin-danger" : "bg-admin-success"
        }`}
      />
      {blocked ? "Blocked" : "Active"}
    </span>
  );
}