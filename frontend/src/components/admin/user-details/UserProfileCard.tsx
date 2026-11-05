import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { AdminUserDetailsDto } from "@/dtos/admin/user/admin-user-details.dto";

import { formatDate, formatLabel } from "./user-details.utils";

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon size={16} className="shrink-0 text-admin-muted" />
      <div className="min-w-0">
        <dt className="text-xs text-admin-muted">{label}</dt>
        <dd className="text-sm font-medium text-admin-text">{value}</dd>
      </div>
    </div>
  );
}

export default function UserProfileCard({
  user,
}: {
  user: AdminUserDetailsDto;
}) {
  const StatusIcon = user.isBlocked ? XCircle : CheckCircle2;

  return (
    <aside className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5 lg:sticky lg:top-24 lg:self-start">
      <div className="h-20 bg-linear-to-r from-admin-accent-hover to-admin-accent" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="relative -mt-10 flex size-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-admin-surface bg-admin-accent-soft text-2xl font-bold text-admin-accent">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={`${user.fullName}'s profile`}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            user.fullName.charAt(0).toUpperCase()
          )}
        </div>

        <h1 className="mt-4 break-words text-xl font-bold text-admin-text">
          {user.fullName}
        </h1>
        <p className="text-sm text-admin-muted">@{user.username}</p>
        <p className="mt-1 flex items-start gap-1.5 break-all text-sm text-admin-muted">
          <Mail size={14} className="mt-0.5 shrink-0" />
          {user.email}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              user.isBlocked
                ? "bg-admin-danger-soft text-admin-danger"
                : "bg-admin-pastel-green text-admin-success"
            }`}
          >
            <StatusIcon size={14} />
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
          <span className="rounded-full bg-admin-accent-soft px-3 py-1.5 text-xs font-semibold text-admin-accent">
            {formatLabel(user.activeRole)}
          </span>
        </div>

        <dl className="mt-6 space-y-4 border-t border-admin-border pt-5">
          <MetaRow
            icon={CalendarDays}
            label="Joined"
            value={formatDate(user.createdAt)}
          />
          <MetaRow
            icon={ShieldCheck}
            label="Email verification"
            value={user.emailVerifiedAt ? "Verified" : "Not verified"}
          />
          <MetaRow
            icon={Clock3}
            label="Last updated"
            value={formatDate(user.updatedAt)}
          />
        </dl>
      </div>
    </aside>
  );
}