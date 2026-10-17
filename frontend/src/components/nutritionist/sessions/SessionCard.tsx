"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, ImageOff, Loader2, Users } from "lucide-react";
import type { NutriSessionListResponseDTO } from "@/dtos/nutritionist/session/session-list-response.dto";
import type { SessionStatus } from "@/types/nutritionist/session/session.types";
import {
  formatDuration,
  formatPrice,
  formatScheduledAt,
  STATUS_STYLES,
  TYPE_LABELS,
} from "@/components/nutritionist/sessions/session-list.constants";

function StatusPill({ status }: { status: SessionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function PricingPill({
  pricing,
}: {
  pricing: NutriSessionListResponseDTO["pricing"];
}) {
  const isFree = pricing.type === "free";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        isFree
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-800"
      }`}
    >
      {formatPrice(pricing)}
    </span>
  );
}

export default function SessionCard({
  session,
}: {
  session: NutriSessionListResponseDTO;
}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const { date, time } = formatScheduledAt(session.scheduledAt);

  const handleViewDetails = () => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.push(`/nutritionist/sessions/${session.sessionId}`);
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-lg">
      <div className="relative h-36 w-full shrink-0 bg-slate-100">
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={session.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-6 w-6 text-slate-300" />
          </div>
        )}

        <div className="absolute left-3 top-3">
          <StatusPill status={session.status} />
        </div>

        <div className="absolute right-3 top-3">
          <PricingPill pricing={session.pricing} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            {TYPE_LABELS[session.type]}
          </p>

          <h2 className="line-clamp-1 text-base font-bold tracking-tight text-slate-900">
            {session.title}
          </h2>

          <p className="line-clamp-2 text-xs font-medium text-slate-500">
            {session.description}
          </p>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              {date} · {time}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{formatDuration(session.durationInMinutes)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>Up to {session.maxParticipants}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          disabled={isNavigating}
          aria-busy={isNavigating}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors duration-150 hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70"
        >
          {isNavigating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading details...
            </>
          ) : (
            "View details"
          )}
        </button>
      </div>
    </article>
  );
}
