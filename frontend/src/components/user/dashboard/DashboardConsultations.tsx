"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import type { UserDashboardConsultationsDTO } from "@/dtos/user/dashboard/user-dashboard-consultations.dto";
import {
  DashboardPanel,
  EmptyState,
  formatDashboardDateTime,
} from "./DashboardShared";

export default function DashboardConsultations({
  consultations,
}: {
  consultations: UserDashboardConsultationsDTO;
}) {
  return (
    <DashboardPanel>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Upcoming consultations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of your scheduled meetings.
          </p>
        </div>
        <CalendarDays className="h-5 w-5 shrink-0 text-emerald-700" />
      </div>

      {consultations.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No upcoming consultations"
            description="Scheduled consultations with your nutritionists will appear here."
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {consultations.map((consultation) => (
            <article
              key={consultation._id}
              className="rounded-xl border border-slate-100 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-semibold text-slate-900">
                    {consultation.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDashboardDateTime(consultation.scheduledAt)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {consultation.durationInMinutes} minutes
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                  {consultation.status}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}