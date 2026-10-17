"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, VideoOff, WifiOff } from "lucide-react";

// Single place for the session page route. Swap in your route constant here.
export const getSessionPagePath = (sessionId: string): string =>
  `/communities/sessions/${sessionId}`;

export function RoomLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-gray-400">
          Preparing your session room...
        </p>
      </div>
    </div>
  );
}

export function RoomConnecting() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
        <p className="mt-4 text-sm text-gray-400">
          Connecting to live session...
        </p>
      </div>
    </div>
  );
}

interface RoomErrorProps {
  message: string;
  backHref?: string;
}

export function RoomError({ message, backHref }: RoomErrorProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <VideoOff className="h-6 w-6 text-red-400" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-white">
          Unable to join session
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-400">{message}</p>

        <button
          type="button"
          onClick={handleBack}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          {backHref ? "Back to Session" : "Go back"}
        </button>
      </div>
    </div>
  );
}

export function RoomDisconnected({ backHref }: { backHref: string }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <WifiOff className="h-6 w-6 text-amber-400" />
        </div>

        <h1 className="mt-5 text-xl font-semibold text-white">
          You were disconnected
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          The connection to the session was lost. Chat messages from this
          meeting are no longer available.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-emerald-500 active:scale-95"
          >
            Rejoin
          </button>

          <button
            type="button"
            onClick={() => router.push(backHref)}
            className="rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/[0.1] active:scale-95"
          >
            Back to Session
          </button>
        </div>
      </div>
    </div>
  );
}