
import type { ReactNode } from "react";
import { CalendarDays, Clock3, Users, Video } from "lucide-react";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

import { TYPE_LABELS } from "./session-details.constants";
import {
  formatSessionDate,
  formatSessionTime,
} from "./session-details.utils";

interface SessionInformationProps {
  session: NutriSessionDetailsResponseDTO;
}

interface SectionTitleProps {
  children: ReactNode;
}

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-emerald-600" />
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        {children}
      </h2>
    </div>
  );
}

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100/80 text-emerald-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function SessionInformation({
  session,
}: SessionInformationProps) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <SectionTitle>Session Information</SectionTitle>

      <div className="mt-4 space-y-4">
        <InfoRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Scheduled"
          value={formatSessionDate(session.scheduledAt)}
        />

        <InfoRow
          icon={<Clock3 className="h-4 w-4" />}
          label="Time"
          value={formatSessionTime(session.scheduledAt)}
        />

        <InfoRow
          icon={<Clock3 className="h-4 w-4" />}
          label="Duration"
          value={`${session.duration} minutes`}
        />

        <InfoRow
          icon={<Users className="h-4 w-4" />}
          label="Maximum Participants"
          value={
            session.maxParticipants
              ? `${session.maxParticipants} participants`
              : "Unlimited"
          }
        />

        <InfoRow
          icon={<Video className="h-4 w-4" />}
          label="Session Type"
          value={TYPE_LABELS[session.type]}
        />
      </div>
    </section>
  );
}
