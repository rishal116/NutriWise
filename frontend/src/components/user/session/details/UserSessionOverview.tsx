import Link from "next/link";
import { Video } from "lucide-react";

import type { UserSessionDetailsDTO } from "@/dtos/user/session/user-session-details.dto";

import UserSessionStatusBadge from "./UserSessionStatusBadge";

interface UserSessionOverviewProps {
  session: UserSessionDetailsDTO;
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

export default function UserSessionOverview({
  session,
}: UserSessionOverviewProps) {
  const { session: details } = session;

  const canJoin =
    session.registrationStatus === "registered" &&
    details.status === "live";

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="relative flex min-h-48 items-center justify-center overflow-hidden bg-emerald-50 sm:min-h-64">
        {details.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={details.thumbnailUrl}
            alt={details.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Video size={64} className="text-emerald-600" />
        )}

        {details.status === "live" && (
          <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
            LIVE NOW
          </span>
        )}
      </div>

      <div className="space-y-5 p-5 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap gap-2">
              <UserSessionStatusBadge status={session.registrationStatus} />
              <UserSessionStatusBadge status={details.status} />
            </div>

            <p className="text-sm font-medium text-emerald-700">
              {formatLabel(details.type)}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {details.title}
            </h1>

            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
              {details.description}
            </p>
          </div>

          <div className="shrink-0 rounded-xl bg-gray-50 p-4 sm:min-w-40">
            <p className="text-sm text-gray-500">Session price</p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              {formatPrice(
                details.pricing.type,
                details.pricing.amount,
                details.pricing.currency,
              )}
            </p>
          </div>
        </div>

        {canJoin && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h2 className="font-semibold text-emerald-900">
              Your session is live
            </h2>

            <p className="mt-1 text-sm text-emerald-800">
              You are registered and ready to join this session.
            </p>

            <Link
              href={`/session-room/${details.roomId}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Video size={18} />
              Join Session
            </Link>
          </div>
        )}

        {session.registrationStatus === "cancelled" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Your registration for this session has been cancelled.
          </div>
        )}
      </div>
    </section>
  );
}