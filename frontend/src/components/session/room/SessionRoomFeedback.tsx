
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, VideoOff } from "lucide-react";

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

interface RoomErrorProps {
  message: string;
  sessionId: string;
}

export function RoomError({ message, sessionId }: RoomErrorProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <VideoOff className="mx-auto h-8 w-8 text-red-400" />

        <h1 className="mt-5 text-xl font-semibold text-white">
          Unable to join session
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-400">
          {message}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(`/communities/sessions/${sessionId}`)
          }
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Session
        </button>
      </div>
    </div>
  );
}
