import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Users, Video } from "lucide-react";

import type { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";
import { SESSION_TYPE_LABELS } from "@/constants/public/session.constants";

interface SessionCardProps {
  session: PublicSessionListItemResponseDTO;
}

export default function SessionCard({ session }: SessionCardProps) {
  const scheduledDate = new Date(session.scheduledAt);

  const formattedDate = scheduledDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isLive = session.status === "live";
  const currencySymbol =
    session.pricing.currency === "inr" ? "₹" : session.pricing.currency;

  return (
    <Link
      href={`/communities/sessions/${session.sessionId}`}
      aria-label={`View session: ${session.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-slate-100">
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={session.title}
            fill
            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(50vw - 32px), 384px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
            <Video aria-hidden="true" className="h-10 w-10 text-emerald-500" />
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
          {SESSION_TYPE_LABELS[session.type]}
        </span>

        {isLive && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-white"
            />
            Live
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="min-h-[88px]">
          <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 transition-colors group-hover:text-emerald-700">
            {session.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
            {session.description || "No description available."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {session.nutritionist.profileImage ? (
            <Image
              src={session.nutritionist.profileImage}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700"
            >
              {session.nutritionist.name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Hosted by</p>
            <p className="truncate text-sm font-medium text-slate-700">
              {session.nutritionist.name}
            </p>
          </div>
        </div>

        <div className="mt-auto space-y-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
            />
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedTime}</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
            <Clock3
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
            />
            <span>{session.durationInMinutes} minutes</span>
            <span aria-hidden="true">·</span>
            <Users
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
            />
            <span>Up to {session.maxParticipants}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          {session.pricing.type === "free" ? (
            <span className="text-sm font-bold text-emerald-700">Free</span>
          ) : (
            <span className="text-sm font-bold text-slate-900">
              {currencySymbol}
              {session.pricing.amount}
            </span>
          )}

          <span className="text-xs font-semibold text-emerald-700">
            View details <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
