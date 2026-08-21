// app/nutritionist/meetings/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createMeetingSchema,
  type CreateMeetingFormValues,
} from "@/validations/nutritionist/meeting/create-meeting.validation";

import toast from "react-hot-toast";
import { ArrowLeft, Timer, Check, Users, RefreshCw, CalendarClock } from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { nutriClientService } from "@/services/nutritionist/nutriClient.service";
import { MeetingType } from "@/enums/nutritionist/meeting/meeting.enum";
import { CreateMeetingDTO } from "@/dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingClientOptionDTO } from "@/dtos/nutritionist/client/client-response.dto";

const getMinDateTimeLocal = (): string => {
  const now = new Date();
  now.setSeconds(0, 0);
  // adjust for local timezone offset so the value reflects local time, not UTC
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function CreateMeetingPage() {
  const router = useRouter();
  const [clients, setClients] = useState<MeetingClientOptionDTO[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());
  const [minDateTime] = useState(getMinDateTimeLocal);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateMeetingFormValues>({
    resolver: zodResolver(createMeetingSchema),
    defaultValues: {
      title: "",
      userId: "",
      scheduledAt: "",
      durationInMinutes: 30,
      type: MeetingType.VIDEO,
    },
  });

  const loadClients = async () => {
    try {
      setClientsLoading(true);
      setClientsError(false);
      const items = await nutriClientService.getMeetingEligibleClients();
      setClients(items);
    } catch {
      setClientsError(true);
      toast.error("Couldn't load your clients");
    } finally {
      setClientsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setClientsLoading(true);
        setClientsError(false);
        const items = await nutriClientService.getMeetingEligibleClients();
        if (!cancelled) setClients(items);
      } catch {
        if (!cancelled) {
          setClientsError(true);
          toast.error("Couldn't load your clients");
        }
      } finally {
        if (!cancelled) setClientsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (values: CreateMeetingFormValues) => {
    try {
      setSubmitting(true);
      const payload: CreateMeetingDTO = {
        title: values.title,
        userId: values.userId,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        durationInMinutes: values.durationInMinutes,
        type: values.type,
      };
      await nutriMeetingService.createMeeting(payload);
      toast.success("Session scheduled!");
      router.push("/nutritionist/meetings");
    } catch {
      toast.error("Failed to schedule the session");
    } finally {
      setSubmitting(false);
    }
  };

  const noClientsAvailable =
    !clientsLoading && !clientsError && clients.length === 0;

  const getInitial = (fullName: string): string =>
    fullName.trim().charAt(0).toUpperCase() || "?";

  const markImageBroken = (id: string) => {
    setBrokenImageIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        <button
          type="button"
          onClick={() => router.push("/nutritionist/meetings")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to consultations
        </button>

        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Schedule Session
          </h1>
          <p className="text-sm text-slate-500 font-medium mb-8">
            Set up a new consultation with your client
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <label
                htmlFor="meeting-title"
                className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1"
              >
                Session Title
              </label>
              <input
                id="meeting-title"
                {...register("title")}
                placeholder="e.g., Weekly Nutrition Review"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
              {errors.title && (
                <p className="text-xs text-rose-600 font-medium ml-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* CLIENT PICKER */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
                Client
              </label>

              <Controller
                control={control}
                name="userId"
                render={({ field }) => {
                  if (clientsLoading) {
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 animate-pulse"
                          >
                            <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 bg-slate-200 rounded w-2/3" />
                              <div className="h-2.5 bg-slate-200 rounded w-4/5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  if (clientsError) {
                    return (
                      <div className="flex flex-col items-center gap-3 py-8 px-4 rounded-xl border border-dashed border-rose-200 bg-rose-50/50 text-center">
                        <p className="text-xs font-semibold text-rose-600">
                          We couldn&apos;t load your client list.
                        </p>
                        <button
                          type="button"
                          onClick={loadClients}
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
                      <div className="flex flex-col items-center gap-2 py-10 px-4 rounded-xl border border-dashed border-slate-300 text-center">
                        <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center">
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
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1"
                    >
                      {clients.map((client) => {
                        const isSelected = field.value === client.id;
                        const showImage =
                          client.profileImage && !brokenImageIds.has(client.id);

                        return (
                          <button
                            key={client.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => field.onChange(client.id)}
                            className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                                : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white"
                            }`}
                          >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-emerald-100/80 flex items-center justify-center border border-emerald-100">
                              {showImage ? (
                                <Image
                                  src={client.profileImage as string}
                                  alt={client.fullName}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                  onError={() => markImageBroken(client.id)}
                                />
                              ) : (
                                <span className="text-emerald-700 font-bold text-sm">
                                  {getInitial(client.fullName)}
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {client.fullName}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {client.email}
                              </p>
                            </div>

                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
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
                <p className="text-xs text-rose-600 font-medium ml-1">
                  {errors.userId.message}
                </p>
              )}
            </div>

            {/* TYPE */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1">
                Type
              </label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => field.onChange(MeetingType.VIDEO)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        field.value === MeetingType.VIDEO
                          ? "bg-white shadow-xs text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(MeetingType.AUDIO)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                        field.value === MeetingType.AUDIO
                          ? "bg-white shadow-xs text-emerald-700"
                          : "text-slate-500"
                      }`}
                    >
                      Audio
                    </button>
                  </div>
                )}
              />
            </div>

            {/* DATE / DURATION */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="meeting-scheduled-at"
                  className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1"
                >
                  Date & Time
                </label>
                <div className="relative">
                  <CalendarClock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    id="meeting-scheduled-at"
                    type="datetime-local"
                    min={minDateTime}
                    {...register("scheduledAt")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3.5 text-xs font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all
                 [&::-webkit-calendar-picker-indicator]:opacity-0
                 [&::-webkit-calendar-picker-indicator]:absolute
                 [&::-webkit-calendar-picker-indicator]:right-0
                 [&::-webkit-calendar-picker-indicator]:w-full
                 [&::-webkit-calendar-picker-indicator]:h-full
                 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                </div>
                {errors.scheduledAt && (
                  <p className="text-xs text-rose-600 font-medium ml-1">
                    {errors.scheduledAt.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="meeting-duration"
                  className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider ml-1"
                >
                  Duration (mins)
                </label>
                <div className="relative">
                  <Timer
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="meeting-duration"
                    type="number"
                    {...register("durationInMinutes", { valueAsNumber: true })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-3.5 text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                {errors.durationInMinutes && (
                  <p className="text-xs text-rose-600 font-medium ml-1">
                    {errors.durationInMinutes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push("/nutritionist/meetings")}
                className="flex-1 py-3.5 font-semibold text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || noClientsAvailable}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl font-semibold text-sm shadow-xs transition-all disabled:opacity-50"
              >
                {submitting ? "Scheduling..." : "Create Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
