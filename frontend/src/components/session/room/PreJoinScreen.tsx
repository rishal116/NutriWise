"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  ShieldAlert,
  Video,
  VideoOff,
} from "lucide-react";

import type { SessionStatus } from "@/constants/common/session.constants";
import ControlButton from "@/components/session/room/ControlButton";
import {
  useMediaPreview,
  type MediaSettings,
  type PreviewError,
} from "@/hooks/session-room/useMediaPreview";

interface PreJoinScreenProps {
  title: string;
  status: SessionStatus;
  nutritionistName: string;
  scheduledAt: Date | string;
  backHref: string;
  /** Resolves to an error message, or null when the join succeeded. */
  onJoin: (settings: MediaSettings) => Promise<string | null>;
}

/** Errors a second attempt can plausibly fix. "denied" needs the browser UI. */
const isRetryable = (error: PreviewError | null): error is PreviewError =>
  !!error && error.kind !== "denied" && error.kind !== "unsupported";

function PreviewVideo({ stream }: { stream: MediaStream | null }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.srcObject = stream;

    return () => {
      element.srcObject = null;
    };
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      className={`h-full w-full -scale-x-100 object-cover ${stream ? "" : "hidden"}`}
    />
  );
}

function DeviceNotice({ error }: { error: PreviewError }) {
  return (
    <div
      role="alert"
      className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700"
    >
      {error.message}
    </div>
  );
}

function formatSchedule(value: Date | string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

export default function PreJoinScreen({
  title,
  status,
  nutritionistName,
  scheduledAt,
  backHref,
  onJoin,
}: PreJoinScreenProps) {
  const preview = useMediaPreview();
  const { audio, video } = preview;

  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const denied =
    audio.error?.kind === "denied" || video.error?.kind === "denied";
  const canRetry = isRetryable(audio.error) || isRetryable(video.error);

  const retry = () => {
    if (isRetryable(audio.error)) audio.toggle();
    if (isRetryable(video.error)) video.toggle();
  };

  const handleJoin = async () => {
    if (joining) return;

    setJoining(true);
    setJoinError(null);

    const settings = preview.getSettings();
    preview.release();

    const error = await onJoin(settings);

    // On success the parent unmounts this screen.
    if (error) {
      setJoinError(error);
      setJoining(false);
      preview.resume();
    }
  };

  const videoOverlay = video.pending ? (
    <>
      <Loader2 className="h-6 w-6 animate-spin" />
      Starting camera…
    </>
  ) : video.error ? (
    "Camera unavailable"
  ) : !video.active ? (
    "Camera is off"
  ) : null;

  const schedule = formatSchedule(scheduledAt);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-white px-4 py-6 text-gray-900">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* Preview */}
        <section className="space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
            <PreviewVideo stream={video.stream} />

            {videoOverlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
                {videoOverlay}
              </div>
            )}

            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-3">
              <ControlButton
                theme="light"
                danger
                pressed={audio.active}
                disabled={audio.pending || joining}
                onClick={audio.toggle}
                label={
                  audio.active ? "Turn off microphone" : "Turn on microphone"
                }
                icon={audio.active ? Mic : MicOff}
              />
              <ControlButton
                theme="light"
                danger
                pressed={video.active}
                disabled={video.pending || joining}
                onClick={video.toggle}
                label={video.active ? "Turn off camera" : "Turn on camera"}
                icon={video.active ? Video : VideoOff}
              />
            </div>
          </div>

          {denied && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            >
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Camera or microphone access is blocked. Click the lock icon in
                the address bar, set both to <b>Allow</b>, and this page will
                update automatically.
              </span>
            </div>
          )}

          {audio.error && audio.error.kind !== "denied" && (
            <DeviceNotice error={audio.error} />
          )}
          {video.error && video.error.kind !== "denied" && (
            <DeviceNotice error={video.error} />
          )}

          {canRetry && (
            <button
              type="button"
              onClick={retry}
              disabled={audio.pending || video.pending || joining}
              className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
            >
              Try again
            </button>
          )}
        </section>

        {/* Ask to join */}
        <section className="space-y-5 text-center lg:text-left">
          <div>
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              with {nutritionistName}
              {status === "live"
                ? " · Live now"
                : schedule
                  ? ` · ${schedule}`
                  : ""}
            </p>
          </div>

          {joinError && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {joinError}
            </p>
          )}

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void handleJoin()}
              disabled={joining}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {joining && <Loader2 className="h-4 w-4 animate-spin" />}
              {joining ? "Asking to join…" : "Ask to join"}
            </button>

            <Link
              href={backHref}
              className="flex items-center justify-center gap-2 text-sm text-gray-500 transition hover:text-gray-900 lg:justify-start"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to session
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
