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
      <Icon size={16} className="shrink-0 text-slate-400" />
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-800">{value}</dd>
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
    <aside className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:self-start">
      <div className="h-20 bg-gradient-to-r from-teal-700 to-teal-500" />

      <div className="px-5 pb-6 sm:px-6">
        <div className="relative -mt-10 flex size-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-teal-50 text-2xl font-bold text-teal-800">
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

        <h1 className="mt-4 break-words text-xl font-bold text-slate-900">
          {user.fullName}
        </h1>
        <p className="text-sm text-slate-500">@{user.username}</p>
        <p className="mt-1 flex items-start gap-1.5 break-all text-sm text-slate-500">
          <Mail size={14} className="mt-0.5 shrink-0" />
          {user.email}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
              user.isBlocked
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <StatusIcon size={14} />
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
          <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
            {formatLabel(user.activeRole)}
          </span>
        </div>

        <dl className="mt-6 space-y-4 border-t border-slate-100 pt-5">
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
