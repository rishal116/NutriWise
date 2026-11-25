import Link from "next/link";
import { CalendarDays, ChevronRight, Clock3, Video } from "lucide-react";

import type { UserSessionListItemDTO } from "@/dtos/user/session/user-session-list.dto";

import UserSessionStatusBadge from "./UserSessionStatusBadge";

interface UserSessionCardProps {
  item: UserSessionListItemDTO;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatPrice(
  type: string,
  amount?: number,
  currency?: string,
): string {
  if (type === "free") return "Free";

  if (amount === undefined || !currency) return "Price unavailable";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}

export default function UserSessionCard({ item }: UserSessionCardProps) {
  return (
    <Link
      href={`/user/sessions/${item.sessionId}`}
      className="group flex h-full min-h-[320px] flex-col rounded-2xl border border-gray-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
    >
      {/* Thumbnail and registration status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50">
          {item.session.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.session.thumbnailUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <Video size={23} className="text-emerald-700" />
          )}
        </div>

        <UserSessionStatusBadge status={item.registrationStatus} />
      </div>

      {/* Session information */}
      <div className="mt-5 flex-1 space-y-4">
        <div>
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition group-hover:text-emerald-700">
            {item.session.title}
          </h3>

          <p className="mt-1.5 text-xs text-gray-500">
            {formatLabel(item.session.type)}
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-500">
          <p className="flex items-start gap-2.5">
            <CalendarDays
              size={16}
              className="mt-0.5 shrink-0 text-gray-400"
            />
            <span>{formatDate(item.session.scheduledAt)}</span>
          </p>

          <p className="flex items-center gap-2.5">
            <Clock3 size={16} className="shrink-0 text-gray-400" />
            {item.session.durationInMinutes} minutes
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <div className="min-w-0 space-y-2">
          <UserSessionStatusBadge status={item.session.status} />

          <p className="truncate text-sm font-semibold text-gray-800">
            {formatPrice(
              item.session.pricing.type,
              item.session.pricing.amount,
              item.session.pricing.currency,
            )}
          </p>
        </div>

        <ChevronRight
          size={20}
          className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-emerald-600"
        />
      </div>
    </Link>
  );
}