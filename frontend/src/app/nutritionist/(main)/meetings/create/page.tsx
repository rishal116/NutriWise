"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  RefreshCw,
  Timer,
  Users,
} from "lucide-react";

import {
  createMeetingSchema,
  type CreateMeetingFormValues,
} from "@/validations/nutritionist/meeting/create-meeting.validation";
import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { nutriClientService } from "@/services/nutritionist/nutriClient.service";
import type { CreateMeetingDTO } from "@/dtos/nutritionist/meeting/create-meeting.dto";
import type { MeetingClientOptionDTO } from "@/dtos/nutritionist/client/client-response.dto";
import {
  MAX_MEETING_DURATION,
  MIN_MEETING_DURATION,
} from "@/constants/meeting";

const getMinDateTimeLocal = (): string => {
  const now = new Date();

  // Round up to the next minute to avoid selecting a time that is
  // already in the past.
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);

  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);

  return localDate.toISOString().slice(0, 16);
};

const getFieldClassName = (hasError: boolean): string =>
  `w-full rounded-xl border p-3.5 text-sm font-medium outline-none transition-all ${
    hasError
      ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
      : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
  }`;

const errorClassName = "ml-1 text-xs font-medium text-rose-600";

export default function CreateMeetingPage() {
  const router = useRouter();

  const [clients, setClients] = useState<MeetingClientOptionDTO[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState(false);
  const [minDateTime, setMinDateTime] = useState("");
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(
    () => new Set(),
  );

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      userId: "",
      scheduledAt: "",
      durationInMinutes: MIN_MEETING_DURATION,
    },
  });

  // Fetch clients once and reuse the same function for retries.
  const loadClients = useCallback(async () => {
    setClientsLoading(true);
    setClientsError(false);

    try {
      const items = await nutriClientService.getMeetingEligibleClients();
      console.log(items);
      
      setClients(items);
    } catch {
      setClients([]);
      setClientsError(true);
      toast.error("Couldn't load your clients.");
    } finally {
      setClientsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadClients();
  }, [loadClients]);

  // Keep the calendar's minimum date current and revalidate the selected
  // date so it cannot remain valid after its time has passed.
  useEffect(() => {
    const updateMinDateTime = () => {
      setMinDateTime(getMinDateTimeLocal());

      if (getValues("scheduledAt")) {
        void trigger("scheduledAt");
      }
    };

    updateMinDateTime();

    const intervalId = window.setInterval(updateMinDateTime, 30_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [getValues, trigger]);

  const onSubmit = async (values: CreateMeetingFormValues) => {
    const scheduledAt = new Date(values.scheduledAt);

    // Final client-side check. The backend must enforce this rule too.
    if (
      !Number.isFinite(scheduledAt.getTime()) ||
      scheduledAt.getTime() <= Date.now()
    ) {
      toast.error("Please select a future date and time.");
      await trigger("scheduledAt");
      return;
    }

    try {
      const payload: CreateMeetingDTO = {
        title: values.title.trim(),
        userId: values.userId,
        scheduledAt: scheduledAt.toISOString(),
        durationInMinutes: values.durationInMinutes,
      };

      await nutriMeetingService.createMeeting(payload);

      toast.success("Session scheduled successfully!");
      router.push("/nutritionist/meetings");
    } catch {
      toast.error("Failed to schedule the session.");
    }
  };

  const noClientsAvailable =
    !clientsLoading && !clientsError && clients.length === 0;

  const getInitial = (fullName: string): string =>
    fullName.trim().charAt(0).toUpperCase() || "?";

  const markImageBroken = (id: string) => {
    setBrokenImageIds((previous) => {
      if (previous.has(id)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(id);

      return next;
    });
  };

  const isSubmitDisabled =
    isSubmitting ||
    !isValid ||
    clientsLoading ||
    clientsError ||
    noClientsAvailable;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:pt-10">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/meetings")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Back to consultations
        </button>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:p-8">
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">
            Schedule Session
          </h1>

          <p className="mb-8 text-sm font-medium text-slate-500">
            Set up a new consultation with your client.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            {/* Session title */}
            <div className="space-y-1.5">
              <label
                htmlFor="meeting-title"
                className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
              >
                Session Title
              </label>

              <input
                id="meeting-title"
                {...register("title")}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "meeting-title-error" : undefined
                }
                placeholder="e.g., Weekly Nutrition Review"
                className={getFieldClassName(Boolean(errors.title))}
              />

              {errors.title && (
                <p
                  id="meeting-title-error"
                  role="alert"
                  className={errorClassName}
                >
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Client picker */}
            <div className="space-y-1.5">
              <p className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Client
              </p>

              <Controller
                control={control}
                name="userId"
                render={({ field }) => {
                  if (clientsLoading) {
                    return (
                      <div
                        aria-label="Loading clients"
                        aria-busy="true"
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                      >
                        {Array.from({ length: 4 }, (_, index) => (
                          <div
                            key={index}
                            className="flex animate-pulse items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
                          >
                            <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200" />

                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-2/3 rounded bg-slate-200" />
                              <div className="h-2.5 w-4/5 rounded bg-slate-200" />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (clientsError) {
                    return (
                      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 px-4 py-8 text-center">
                        <p className="text-xs font-semibold text-rose-600">
                          We couldn&apos;t load your client list.
                        </p>

                        <button
                          type="button"
                          onClick={() => void loadClients()}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          <RefreshCw size={12} />
                          Try again
                        </button>
                      </div>
                    );
                  }

                  if (noClientsAvailable) {
                    return (
                      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                          <Users className="text-emerald-600" size={18} />
                        </div>

                        <p className="text-sm font-bold text-slate-600">
                          No eligible clients yet
                        </p>

                        <p className="text-xs text-slate-400">
                          Clients appear here once they&apos;re ready for a
                          session.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      role="radiogroup"
                      aria-label="Select client"
                      aria-invalid={Boolean(errors.userId)}
                      aria-describedby={
                        errors.userId ? "meeting-client-error" : undefined
                      }
                      className={`grid max-h-80 grid-cols-1 gap-3 overflow-y-auto rounded-xl pr-1 ${
                        errors.userId ? "ring-1 ring-rose-300" : ""
                      } sm:grid-cols-2`}
                    >
                      {clients.map((client) => {
                        const isSelected = field.value === client.id;
                        const showImage =
                          Boolean(client.profileImage) &&
                          !brokenImageIds.has(client.id);

                        return (
                          <button
                            key={client.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => field.onChange(client.id)}
                            onBlur={field.onBlur}
                            className={`relative flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                                : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white"
                            }`}
                          >
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-100/80">
                              {showImage && client.profileImage ? (
                                <Image
                                  src={client.profileImage}
                                  alt={client.fullName}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                  onError={() => markImageBroken(client.id)}
                                />
                              ) : (
                                <span className="text-sm font-bold text-emerald-700">
                                  {getInitial(client.fullName)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-slate-800">
                                {client.fullName}
                              </p>

                              <p className="truncate text-xs text-slate-400">
                                {client.email}
                              </p>
                            </div>

                            {isSelected && (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                                <Check
                                  size={12}
                                  className="text-white"
                                  strokeWidth={3}
                                />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                }}
              />

              {errors.userId && (
                <p
                  id="meeting-client-error"
                  role="alert"
                  className={errorClassName}
                >
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* Session type is informational; it is not submitted as a field. */}
            <div className="space-y-1.5">
              <p className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Session Type
              </p>

              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <CalendarClock size={18} className="text-emerald-700" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Video Consultation
                  </p>

                  <p className="text-xs text-slate-500">
                    Meet your client face-to-face online.
                  </p>
                </div>

                <Check
                  size={18}
                  className="ml-auto text-emerald-700"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Date and duration */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="meeting-scheduled-at"
                  className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Date &amp; Time
                </label>

                <div className="relative">
                  <CalendarClock
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="meeting-scheduled-at"
                    type="datetime-local"
                    min={minDateTime || undefined}
                    {...register("scheduledAt")}
                    aria-invalid={Boolean(errors.scheduledAt)}
                    aria-describedby={
                      errors.scheduledAt
                        ? "meeting-scheduled-at-error"
                        : undefined
                    }
                    className={`${getFieldClassName(
                      Boolean(errors.scheduledAt),
                    )} py-3.5 pl-10 pr-3.5 text-xs font-semibold [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                  />
                </div>

                {errors.scheduledAt && (
                  <p
                    id="meeting-scheduled-at-error"
                    role="alert"
                    className={errorClassName}
                  >
                    {errors.scheduledAt.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="meeting-duration"
                  className="ml-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500"
                >
                  Duration (mins)
                </label>

                <div className="relative">
                  <Timer
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="meeting-duration"
                    type="number"
                    min={MIN_MEETING_DURATION}
                    max={MAX_MEETING_DURATION}
                    step={1}
                    {...register("durationInMinutes", {
                      valueAsNumber: true,
                    })}
                    aria-invalid={Boolean(errors.durationInMinutes)}
                    aria-describedby={
                      errors.durationInMinutes
                        ? "meeting-duration-error"
                        : undefined
                    }
                    className={`${getFieldClassName(
                      Boolean(errors.durationInMinutes),
                    )} pl-10`}
                  />
                </div>

                <p className="ml-1 text-xs text-slate-400">
                  Choose between {MIN_MEETING_DURATION} and{" "}
                  {MAX_MEETING_DURATION} minutes.
                </p>

                {errors.durationInMinutes && (
                  <p
                    id="meeting-duration-error"
                    role="alert"
                    className={errorClassName}
                  >
                    {errors.durationInMinutes.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/nutritionist/meetings")}
                disabled={isSubmitting}
                className="flex-1 py-3.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="flex-1 rounded-xl bg-emerald-700 py-3.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Scheduling..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
