
"use client";

import dynamic from "next/dynamic";
import { Loader2, Users } from "lucide-react";
import { useState } from "react";

const SessionParticipants = dynamic(
  () => import("@/components/nutritionist/sessions/details/SessionParticipants"),
  {
    loading: () => (
      <div className="flex min-h-40 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
        Loading participants section...
      </div>
    ),
  },
);

interface SessionParticipantsSectionProps {
  sessionId: string;
  isFree: boolean;
}

export default function SessionParticipantsSection({
  sessionId,
  isFree,
}: SessionParticipantsSectionProps) {
  const [showParticipants, setShowParticipants] = useState(false);

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Manage Participants
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Search registrations and review registration and payment statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowParticipants((current) => !current)}
          aria-expanded={showParticipants}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <Users className="h-4 w-4" />
          {showParticipants ? "Hide participants" : "View participants"}
        </button>
      </div>

      {showParticipants && (
        <div className="mt-6">
          <SessionParticipants
            sessionId={sessionId}
            isFree={isFree}
          />
        </div>
      )}
    </section>
  );
}
