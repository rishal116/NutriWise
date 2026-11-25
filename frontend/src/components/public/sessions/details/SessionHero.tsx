
import Image from "next/image";
import { Radio, Video } from "lucide-react";

import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";

interface SessionHeroProps {
  session: PublicSessionDetailsResponseDTO;
}

export default function SessionHero({ session }: SessionHeroProps) {
  const isLive = session.status === "live";
  const isCompleted = session.status === "completed";
  const isCancelled = session.status === "cancelled";

  const statusBadgeClass = isLive
    ? "bg-red-500 text-white"
    : isCompleted || isCancelled
      ? "bg-slate-800 text-white"
      : "bg-white/95 text-emerald-700";

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-emerald-50 to-teal-100 shadow-sm">
      {session.thumbnailUrl ? (
        <Image
          src={session.thumbnailUrl}
          alt={session.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 768px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-emerald-400">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70">
            <Video className="h-8 w-8" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600/70">
            {session.type.replaceAll("_", " ")}
          </span>
        </div>
      )}

      <span
        className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm sm:left-5 sm:top-5 ${statusBadgeClass}`}
      >
        {isLive && <Radio className="h-3.5 w-3.5 animate-pulse" />}

        {isLive ? "LIVE NOW" : session.status.toUpperCase()}
      </span>
    </div>
  );
}
