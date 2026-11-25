
import Image from "next/image";
import { Video } from "lucide-react";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

import {
  STATUS_DOT,
  STATUS_STYLES,
  TYPE_LABELS,
} from "./session-details.constants";

interface SessionOverviewProps {
  session: NutriSessionDetailsResponseDTO;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-emerald-600" />
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        {children}
      </h2>
    </div>
  );
}

export default function SessionOverview({
  session,
}: SessionOverviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
        {session.thumbnailUrl ? (
          <Image
            src={session.thumbnailUrl}
            alt={session.title}
            fill
            sizes="(max-width: 1280px) 100vw, 60vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-50">
            <Video className="h-10 w-10 text-emerald-300" />
          </div>
        )}

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2 sm:left-4 sm:top-4">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold capitalize shadow-xs ${STATUS_STYLES[session.status]}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[session.status]}`}
            />
            {session.status}
          </span>

          <span className="rounded-full border border-emerald-200 bg-white/90 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-xs backdrop-blur-sm">
            {TYPE_LABELS[session.type]}
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <SectionTitle>About this session</SectionTitle>

        <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
          {session.description}
        </p>
      </div>
    </section>
  );
}
