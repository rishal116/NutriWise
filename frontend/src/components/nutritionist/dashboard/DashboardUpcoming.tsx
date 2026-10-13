"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarX2, ChevronRight } from "lucide-react";

import { useAsyncData } from "@/hooks/common/useAsyncData";
import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import {
  MeetingSortBy,
  MeetingSortOrder,
  MeetingStatus,
} from "@/enums/nutritionist/meeting/meeting.enum";

import DashboardCard from "./DashboardCard";
import {
  WidgetEmpty,
  WidgetError,
  WidgetSkeleton,
} from "./DashboardWidgetStates";

// Fetch extra, then drop anything that already ended: the list endpoints have
// no "from" filter, so never-closed past items would otherwise sort first.
const FETCH_LIMIT = 10;
const VISIBLE_LIMIT = 5;

interface ScheduleItem {
  key: string;
  kind: "Meeting" | "Live session";
  title: string;
  detail: string;
  scheduledAt: string;
  durationInMinutes: number;
  href: string;
}

async function fetchUpcoming(): Promise<ScheduleItem[]> {
  const [meetingsRes, sessionsRes] = await Promise.all([
    nutriMeetingService.getMeetings({
      limit: FETCH_LIMIT,
      status: MeetingStatus.SCHEDULED,
      sortBy: MeetingSortBy.SCHEDULED_AT,
      sortOrder: MeetingSortOrder.ASC,
    }),
    nutriSessionService.getSessions({
      limit: FETCH_LIMIT,
      status: "scheduled",
      sortBy: "date_asc",
    }),
  ]);

  const meetings: ScheduleItem[] = meetingsRes.data.items.map((meeting) => ({
    key: `meeting-${meeting.id}`,
    kind: "Meeting",
    title: meeting.title,
    detail: meeting.user.fullName,
    scheduledAt: meeting.scheduledAt,
    durationInMinutes: meeting.durationInMinutes,
    href: `/nutritionist/meetings/${meeting.id}`,
  }));

  const sessions: ScheduleItem[] = sessionsRes.items.map((session) => ({
    key: `session-${session.sessionId}`,
    kind: "Live session",
    title: session.title,
    detail: session.maxParticipants
      ? `Up to ${session.maxParticipants} participants`
      : "Unlimited participants",
    scheduledAt: session.scheduledAt,
    durationInMinutes: session.durationInMinutes,
    href: `/nutritionist/sessions/${session.sessionId}`,
  }));

  const now = Date.now();

  return [...meetings, ...sessions]
    .filter(
      (item) =>
        new Date(item.scheduledAt).getTime() + item.durationInMinutes * 60_000 >
        now,
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    )
    .slice(0, VISIBLE_LIMIT);
}

export default function DashboardUpcoming({
  className,
}: {
  className?: string;
}) {
  const { data, loading, error, reload } = useAsyncData(fetchUpcoming);

  let content: ReactNode;

  if (loading) {
    content = <WidgetSkeleton rows={4} />;
  } else if (error) {
    content = <WidgetError message={error} onRetry={() => void reload()} />;
  } else if (!data || data.length === 0) {
    content = (
      <WidgetEmpty
        icon={<CalendarX2 className="h-5 w-5" />}
        title="Nothing scheduled"
        description="Meetings and live sessions you schedule will show up here."
        action={
          <Link
            href="/nutritionist/meetings/create"
            className="inline-flex items-center rounded-xl bg-emerald-700 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800"
          >
            Schedule a meeting
          </Link>
        }
      />
    );
  } else {
    content = (
      <ul className="-my-3 divide-y divide-slate-100">
        {data.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 py-3 focus-visible:outline-none"
            >
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
                <span className="text-[10px] font-semibold uppercase leading-none tracking-wider">
                  {new Date(item.scheduledAt).toLocaleDateString(undefined, {
                    month: "short",
                  })}
                </span>
                <span className="text-sm font-bold leading-tight">
                  {new Date(item.scheduledAt).toLocaleDateString(undefined, {
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 transition-colors duration-150 group-hover:text-emerald-700">
                  {item.title}
                </p>
                <p className="truncate text-xs font-medium text-slate-500">
                  {item.kind} · {item.detail}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-slate-700">
                  {new Date(item.scheduledAt).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {item.durationInMinutes} min
                </p>
              </div>

              <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-300 transition-colors duration-150 group-hover:text-emerald-600 sm:block" />
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <DashboardCard
      title="Upcoming"
      description="Your next meetings and live sessions"
      links={[
        { href: "/nutritionist/meetings", label: "Meetings" },
        { href: "/nutritionist/sessions", label: "Sessions" },
      ]}
      className={className}
    >
      {content}
    </DashboardCard>
  );
}
