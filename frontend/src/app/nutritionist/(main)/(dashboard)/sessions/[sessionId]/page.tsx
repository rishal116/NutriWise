"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Users,
  Video,
  Pencil,
  Trash2,
  Loader2,
  IndianRupee,
  Send,
  DoorOpen,
} from "lucide-react";

import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { nutriSessionService } from "@/services/nutritionist/nutriSession.service";
import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

type SessionStatusValue = NutriSessionDetailsResponseDTO["status"];
type SessionTypeValue = NutriSessionDetailsResponseDTO["type"];

const STATUS_STYLES: Record<SessionStatusValue, string> = {
  draft: "bg-slate-50 text-slate-700 border-slate-200",
  scheduled: "bg-sky-50 text-sky-700 border-sky-200",
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_DOT: Record<SessionStatusValue, string> = {
  draft: "bg-slate-400",
  scheduled: "bg-sky-500",
  live: "bg-emerald-500",
  completed: "bg-slate-400",
  cancelled: "bg-rose-500",
};

const TYPE_LABELS: Record<SessionTypeValue, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  group_consultation: "Group Consultation",
  qna: "Q&A",
  seminar: "Seminar",
};

function formatPrice(pricing: NutriSessionDetailsResponseDTO["pricing"]) {
  if (pricing.type === "free") return "Free";
  return pricing.currency === "inr"
    ? `₹${pricing.amount.toLocaleString("en-IN")}`
    : `${pricing.currency} ${pricing.amount}`;
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-5 w-1 rounded-full bg-emerald-600" />
      <h2 className="text-base font-bold tracking-tight text-slate-900">
        {children}
      </h2>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
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

export default function SessionDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<NutriSessionDetailsResponseDTO | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await nutriSessionService.getSessionDetails(sessionId);
        setSession(data);
      } catch {
        setError("Unable to load session details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handlePublish = async () => {
    if (!session || session.status !== "draft") return;
    try {
      setPublishing(true);
      setError(null);
      const updatedSession = await nutriSessionService.publishSession(
        session.sessionId,
      );
      setSession(updatedSession);
      setShowPublishConfirm(false);
    } catch {
      setError("Unable to publish the session.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!session) return;
    try {
      setDeleting(true);
      await nutriSessionService.deleteSession(session.sessionId);
      router.push("/nutritionist/sessions");
    } catch {
      setError("Unable to delete the session.");
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-7 w-56 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-28 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors duration-150 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-10 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Video className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-rose-700">
            {error ?? "Session not found."}
          </p>
        </div>
      </div>
    );
  }

  const scheduledDate = new Date(session.scheduledAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
              Session Details
            </p>
            <h1 className="mt-1 line-clamp-2 break-words text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {session.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:shrink-0 md:flex-nowrap">
          <button
            type="button"
            onClick={() =>
              router.push(`/nutritionist/sessions/${session.sessionId}/edit`)
            }
            className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 md:flex-none"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          {session.status === "draft" && (
            <button
              type="button"
              onClick={() => setShowPublishConfirm(true)}
              disabled={publishing}
              className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-xs md:flex-none"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {publishing ? "Publishing..." : "Publish"}
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-xs transition-colors duration-150 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:pointer-events-none disabled:opacity-50 md:flex-none"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      {/* One grid so every card edge lines up: overview | info, then pricing | room */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        {/* Overview */}
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

        {/* Session Info */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <SectionTitle>Session Information</SectionTitle>

          <div className="mt-4 space-y-4">
            <InfoRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Scheduled"
              value={scheduledDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
            <InfoRow
              icon={<Clock3 className="h-4 w-4" />}
              label="Time"
              value={scheduledDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <InfoRow
              icon={<Clock3 className="h-4 w-4" />}
              label="Duration"
              value={`${session.durationInMinutes} minutes`}
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

        {/* Pricing */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <SectionTitle>Pricing</SectionTitle>
              <p className="mt-1 pl-3.5 text-xs font-medium text-slate-500">
                Session access pricing
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
                <IndianRupee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {session.pricing.type}
                </p>
                <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {formatPrice(session.pricing)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Room */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <SectionTitle>Meeting Room</SectionTitle>
          {session.roomId ? (
            <button
              type="button"
              onClick={() => router.push(`/session-room/${session.sessionId}`)}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left transition-colors duration-150 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-700">
                <DoorOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Room ID
                </p>
                <code className="block truncate text-xs font-semibold text-emerald-700">
                  {session.roomId}
                </code>
              </div>
              <span className="shrink-0 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">
                Enter
              </span>
            </button>
          ) : (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                <DoorOpen className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-slate-500">
                No room assigned yet — created automatically when the session
                goes live.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-1 border-t border-slate-100 pt-4 text-xs font-medium text-slate-500 sm:flex-row sm:items-center sm:gap-3">
        <span>
          Created {new Date(session.createdAt).toLocaleDateString("en-IN")}
        </span>
        <span className="hidden text-slate-300 sm:block">•</span>
        <span>
          Updated {new Date(session.updatedAt).toLocaleDateString("en-IN")}
        </span>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showPublishConfirm}
        onOpenChange={setShowPublishConfirm}
        title="Publish this session?"
        description="Once published, the session becomes visible and bookable by users. You can still edit details afterward."
        confirmLabel="Publish"
        variant="default"
        loading={publishing}
        onConfirm={handlePublish}
        icon={<Send className="h-5 w-5" />}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete this session?"
        description="This action is permanent and cannot be undone. All session data will be lost."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        icon={<Trash2 className="h-5 w-5" />}
      />
    </div>
  );
}