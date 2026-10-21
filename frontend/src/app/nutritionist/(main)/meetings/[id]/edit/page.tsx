"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CalendarDays,
  LoaderCircle,
  Save,
  Timer,
  Video,
} from "lucide-react";

import { nutriMeetingService } from "@/services/nutritionist/nutriMeeting.service";
import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";
import type { MeetingDetailsResponseDTO } from "@/dtos/nutritionist/meeting/meeting-details-response.dto";

const IST_OFFSET = "+05:30";

function toISTInputValue(value: string | Date): string {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return "";

  return new Date(date.getTime() + 330 * 60 * 1000).toISOString().slice(0, 16);
}

function istInputToISOString(value: string): string {
  return new Date(`${value}:00${IST_OFFSET}`).toISOString();
}

function getISTMinimum(): string {
  return toISTInputValue(new Date());
}

export default function EditMeetingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const meetingId = params.id;

  const [meeting, setMeeting] = useState<MeetingDetailsResponseDTO | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("30");
  const [minimumDate, setMinimumDate] = useState(getISTMinimum);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const loadMeeting = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await nutriMeetingService.getMeetingDetails(meetingId);
      const data = response.data;

      if (data?.status !== MeetingStatus.SCHEDULED) {
        toast.error("Only scheduled meetings can be edited");
        router.replace(
          `/nutritionist/meetings/${encodeURIComponent(meetingId)}`,
        );
        return;
      }

      setMeeting(data);
      setTitle(data.title);
      setScheduledAt(toISTInputValue(data.scheduledAt));
      setDuration(String(data.durationInMinutes));
    } catch {
      setError(true);
      toast.error("Couldn't load meeting details");
    } finally {
      setLoading(false);
    }
  }, [meetingId, router]);

  useEffect(() => {
    void loadMeeting();
  }, [loadMeeting]);

  useEffect(() => {
    const updateMinimum = () => setMinimumDate(getISTMinimum());

    updateMinimum();
    const intervalId = window.setInterval(updateMinimum, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!meeting || saving) return;

    const trimmedTitle = title.trim();
    const durationInMinutes = Number(duration);

    if (!trimmedTitle || trimmedTitle.length > 120) {
      toast.error("Title must contain 1–120 characters");
      return;
    }

    if (!scheduledAt) {
      toast.error("Please choose a date and time");
      return;
    }

    const scheduledDate = new Date(`${scheduledAt}:00${IST_OFFSET}`);

    if (
      !Number.isFinite(scheduledDate.getTime()) ||
      scheduledDate.getTime() <= Date.now()
    ) {
      toast.error("Meeting time must be in the future");
      return;
    }

    if (
      !Number.isInteger(durationInMinutes) ||
      durationInMinutes < 5 ||
      durationInMinutes > 240
    ) {
      toast.error("Duration must be between 5 and 240 minutes");
      return;
    }

    try {
      setSaving(true);

      // Implement updateMeeting in nutriMeetingService and the matching
      // backend endpoint before using this page to persist changes.
      await nutriMeetingService.updateMeeting(meetingId, {
        title: trimmedTitle,
        scheduledAt: istInputToISOString(scheduledAt),
        durationInMinutes,
      });

      toast.success("Meeting updated successfully");
      router.replace(`/nutritionist/meetings/${encodeURIComponent(meetingId)}`);
    } catch {
      toast.error("Couldn't update the meeting");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8f7] px-4 py-10">
        <div className="mx-auto max-w-2xl animate-pulse space-y-5">
          <div className="h-5 w-40 rounded bg-slate-200" />
          <div className="h-48 rounded-3xl bg-white" />
          <div className="h-72 rounded-3xl bg-white" />
        </div>
      </main>
    );
  }

  if (error || !meeting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8f7] px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-lg font-bold text-slate-900">
            {"Couldn't load meeting"}
          </h1>
          <button
            type="button"
            onClick={() => void loadMeeting()}
            className="mt-5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f8f7] px-4 py-7 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/nutritionist/meetings/${encodeURIComponent(meetingId)}`,
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft size={17} />
          Back to meeting
        </button>

        <header className="mb-6 rounded-3xl bg-emerald-950 p-6 text-white sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
            <Video size={23} />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
            Consultation settings
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Edit meeting
          </h1>
          <p className="mt-2 text-sm leading-6 text-emerald-100/80">
            Update the details of your scheduled video consultation.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Meeting title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={1}
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Nutrition follow-up"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <p className="mt-1.5 text-right text-xs text-slate-400">
              {title.trim().length}/120
            </p>
          </div>

          <div>
            <label
              htmlFor="scheduledAt"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
            >
              <CalendarDays size={16} className="text-emerald-700" />
              Date and time
            </label>
            <input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              min={minimumDate}
              value={scheduledAt}
              onChange={(event) => setScheduledAt(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Enter the time in Indian Standard Time (IST, UTC+05:30). The
              meeting time is saved as a UTC timestamp.
            </p>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
            >
              <Timer size={16} className="text-emerald-700" />
              Duration
            </label>
            <select
              id="duration"
              name="durationInMinutes"
              required
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
              <option value="180">180 minutes</option>
              <option value="240">240 minutes</option>
            </select>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <Video size={19} className="mt-0.5 shrink-0 text-emerald-700" />
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Video consultation
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                This meeting uses video. The session type cannot be changed.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                router.push(
                  `/nutritionist/meetings/${encodeURIComponent(meetingId)}`,
                )
              }
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim() || !scheduledAt}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
