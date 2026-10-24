"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  LoaderCircle,
  RefreshCw,
  Target,
} from "lucide-react";

import { nutriProgramProgressService } from "@/services/nutritionist/nutri-program-progress.service";

import type {
  ProgramProgressResponseDTO,
  ProgramDaySummaryResponseDTO,
  DayActivityResultResponseDTO,
} from "@/dtos/nutritionist/program-progress/program-progress-response.dto";

import type { GetProgramDaysQueryDTO } from "@/dtos/nutritionist/program-progress/program-progress-request.dto";

const PAGE_SIZE = 10;

const DAY_STATUS_STYLES: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  missed: "bg-rose-100 text-rose-700",
  skipped: "bg-slate-200 text-slate-700",
};

const ACTIVITY_STATUS_STYLES: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-600",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-emerald-100 text-emerald-700",
  skipped: "bg-rose-100 text-rose-700",
};

function formatDate(date: string | null | undefined): string {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Not available";

  return parsed.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: string | null | undefined): string {
  if (!status) return "Not tracked";

  return status.replaceAll("_", " ");
}

function StatCard({
  label,
  value,
  icon,
  description,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          {icon}
        </span>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      {description && (
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const styles =
    (status && DAY_STATUS_STYLES[status]) ??
    "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {formatStatus(status)}
    </span>
  );
}

export default function ProgramProgressPage() {
  const params = useParams<{
    clientId: string;
    userProgramId: string;
  }>();

  const clientId = params.clientId;
  const userProgramId = params.userProgramId;

  const [overview, setOverview] =
    useState<ProgramProgressResponseDTO | null>(null);

  const [days, setDays] = useState<ProgramDaySummaryResponseDTO[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [selectedDay, setSelectedDay] =
    useState<ProgramDaySummaryResponseDTO | null>(null);

  const [activities, setActivities] =
    useState<DayActivityResultResponseDTO[]>([]);

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [daysLoading, setDaysLoading] = useState(true);
  const [moreDaysLoading, setMoreDaysLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [daysError, setDaysError] = useState<string | null>(null);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError(null);

    try {
      const result =
        await nutriProgramProgressService.getProgramOverview(
          clientId,
          userProgramId,
        );

      setOverview(result);
    } catch (error) {
      setOverviewError(
        error instanceof Error
          ? error.message
          : "Failed to load program progress.",
      );
    } finally {
      setOverviewLoading(false);
    }
  }, [clientId, userProgramId]);

  const loadDays = useCallback(async () => {
    setDaysLoading(true);
    setDaysError(null);

    try {
      const query: GetProgramDaysQueryDTO = {
        limit: PAGE_SIZE,
      };

      const result = await nutriProgramProgressService.getProgramDays(
        clientId,
        userProgramId,
        query,
      );

      setDays(result.items);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      setDaysError(
        error instanceof Error
          ? error.message
          : "Failed to load program days.",
      );
    } finally {
      setDaysLoading(false);
    }
  }, [clientId, userProgramId]);

  const loadMoreDays = async () => {
    if (!hasMore || moreDaysLoading || !nextCursor) return;

    setMoreDaysLoading(true);
    setDaysError(null);

    try {
      const query: GetProgramDaysQueryDTO = {
        limit: PAGE_SIZE,
        cursor: nextCursor,
      };

      const result = await nutriProgramProgressService.getProgramDays(
        clientId,
        userProgramId,
        query,
      );

      setDays((currentDays) => [...currentDays, ...result.items]);
      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch (error) {
      setDaysError(
        error instanceof Error
          ? error.message
          : "Failed to load more program days.",
      );
    } finally {
      setMoreDaysLoading(false);
    }
  };

  const loadDayActivities = useCallback(
    async (day: ProgramDaySummaryResponseDTO) => {
      setSelectedDay(day);
      setActivities([]);
      setActivitiesError(null);
      setActivitiesLoading(true);

      try {
        const result =
          await nutriProgramProgressService.getDayActivityResults(
            clientId,
            userProgramId,
            day.dayNumber,
          );

        setActivities(result);
      } catch (error) {
        setActivitiesError(
          error instanceof Error
            ? error.message
            : "Failed to load day activities.",
        );
      } finally {
        setActivitiesLoading(false);
      }
    },
    [clientId, userProgramId],
  );

  useEffect(() => {
    void loadOverview();
    void loadDays();
  }, [loadOverview, loadDays]);

  if (overviewLoading && !overview) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoaderCircle className="h-7 w-7 animate-spin text-emerald-600" />
        <span className="ml-3 text-sm text-slate-500">
          Loading program progress...
        </span>
      </div>
    );
  }

  if (overviewError && !overview) {
    return (
      <main className="mx-auto max-w-7xl p-5 sm:p-8">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            <div className="flex-1">
              <h2 className="font-semibold text-rose-900">
                Unable to load program progress
              </h2>
              <p className="mt-1 text-sm text-rose-700">{overviewError}</p>
              <button
                type="button"
                onClick={() => void loadOverview()}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!overview) return null;

  const completion = Math.min(
    100,
    Math.max(0, overview.completionPercentage),
  );

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Program Progress
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor your client&apos;s daily activities and overall progress.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void loadOverview();
            void loadDays();
            if (selectedDay) void loadDayActivities(selectedDay);
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Program status
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold capitalize text-slate-900">
                {formatStatus(overview.status)}
              </h2>
              <StatusBadge status={overview.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {formatDate(overview.startDate)} – {formatDate(overview.endDate)}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-slate-500">Overall completion</p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">
              {completion}%
            </p>
          </div>
        </div>

        <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>
            {overview.completedDays} of {overview.totalDays} days completed
          </span>
          <span>{overview.durationDays} days total</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Current day"
          value={`${overview.currentDay} / ${overview.durationDays}`}
          icon={<CalendarDays className="h-5 w-5" />}
          description="Current program position"
        />
        <StatCard
          label="Activities completed"
          value={`${overview.completedActivities} / ${overview.totalActivities}`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description={`${overview.skippedActivities} skipped activities`}
        />
        <StatCard
          label="Current streak"
          value={`${overview.currentStreak} days`}
          icon={<Flame className="h-5 w-5" />}
          description="Consecutive-day streak"
        />
        <StatCard
          label="Longest streak"
          value={`${overview.longestStreak} days`}
          icon={<Target className="h-5 w-5" />}
          description={`Last completed day: ${overview.lastCompletedDay || "—"}`}
        />
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-900">Program days</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select a day to inspect its activities.
              </p>
            </div>
            <CalendarDays className="h-5 w-5 text-emerald-700" />
          </div>

          {daysLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading program days...
            </div>
          ) : daysError && days.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-rose-600">{daysError}</p>
              <button
                type="button"
                onClick={() => void loadDays()}
                className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          ) : days.length === 0 ? (
            <div className="p-10 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                No program days found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {days.map((day) => {
                const isSelected =
                  selectedDay?.dayNumber === day.dayNumber;

                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => void loadDayActivities(day)}
                    className={`flex w-full items-center gap-3 p-4 text-left transition hover:bg-slate-50 ${
                      isSelected ? "bg-emerald-50/70" : "bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {day.dayNumber}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          Day {day.dayNumber}
                        </p>
                        <StatusBadge status={day.status} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(day.date)} · {day.completedActivities}/
                        {day.totalActivities} activities
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-600"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, day.completionPercentage),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                );
              })}
            </div>
          )}

          {daysError && days.length > 0 && (
            <p className="px-5 pt-3 text-sm text-rose-600">{daysError}</p>
          )}

          {hasMore && (
            <div className="border-t border-slate-100 p-4">
              <button
                type="button"
                disabled={moreDaysLoading}
                onClick={() => void loadMoreDays()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {moreDaysLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {moreDaysLoading ? "Loading..." : "Load more days"}
              </button>
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5">
            <div>
              <h2 className="font-bold text-slate-900">
                {selectedDay
                  ? `Day ${selectedDay.dayNumber} activities`
                  : "Day activities"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedDay
                  ? `${selectedDay.completedActivities} completed · ${selectedDay.skippedActivities} skipped`
                  : "Choose a program day to view its activity results."}
              </p>
            </div>
            <Activity className="h-5 w-5 text-emerald-700" />
          </div>

          {!selectedDay ? (
            <div className="p-10 text-center">
              <Target className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">
                Select a day from the list to view activities.
              </p>
            </div>
          ) : activitiesLoading ? (
            <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-500">
              <LoaderCircle className="h-5 w-5 animate-spin" />
              Loading activities...
            </div>
          ) : activitiesError ? (
            <div className="p-5">
              <p className="text-sm text-rose-600">{activitiesError}</p>
              <button
                type="button"
                onClick={() => void loadDayActivities(selectedDay)}
                className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Try again
              </button>
            </div>
          ) : activities.length === 0 ? (
            <div className="p-10 text-center">
              <Activity className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">
                No activities found for this day.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => (
                <article key={activity.activityId} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900">
                        {activity.title}
                      </h3>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {activity.category.replaceAll("_", " ")} ·{" "}
                        {activity.valueType.replaceAll("_", " ")}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                        ACTIVITY_STATUS_STYLES[activity.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {formatStatus(activity.status)}
                    </span>
                  </div>

                  {(activity.targetValue !== undefined ||
                    activity.recordedValue !== undefined ||
                    activity.recordedText) && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {activity.targetValue !== undefined && (
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Target</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {activity.targetValue}
                            {activity.targetUnit
                              ? ` ${activity.targetUnit}`
                              : ""}
                          </p>
                        </div>
                      )}

                      {activity.recordedValue !== undefined && (
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Recorded</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {activity.recordedValue}
                            {activity.unit ? ` ${activity.unit}` : ""}
                          </p>
                        </div>
                      )}

                      {activity.recordedText && (
                        <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">
                            Recorded response
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">
                            {activity.recordedText}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activity.evidence.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-slate-500">
                        Evidence
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {activity.evidence.map((url, index) => (
                          <a
                            key={`${activity.activityId}-evidence-${index}`}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                          >
                            View attachment {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {activity.skippedReason && (
                    <p className="mt-3 text-sm text-rose-700">
                      <span className="font-semibold">Skip reason: </span>
                      {activity.skippedReason}
                    </p>
                  )}

                  {activity.notes && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
                      <span className="font-semibold text-slate-700">
                        Client notes:{" "}
                      </span>
                      {activity.notes}
                    </p>
                  )}

                  {activity.nutritionistFeedback && (
                    <p className="mt-3 whitespace-pre-wrap rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-900">
                      <span className="font-semibold">
                        Nutritionist feedback:{" "}
                      </span>
                      {activity.nutritionistFeedback}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                    {activity.startedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Started {formatDate(activity.startedAt)}
                      </span>
                    )}
                    {activity.completedAt && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Completed {formatDate(activity.completedAt)}
                      </span>
                    )}
                    <span>
                      Last updated by:{" "}
                      {formatStatus(activity.lastUpdatedBy)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
