
"use client";

import { ArrowLeft, Video } from "lucide-react";
import { useRouter } from "next/navigation";

interface SessionDetailsErrorProps {
  message: string;
}

export default function SessionDetailsError({
  message,
}: SessionDetailsErrorProps) {
  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 rounded-lg text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-rose-200 bg-rose-50 p-10 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <Video className="h-5 w-5" />
        </div>

        <p className="text-sm font-semibold text-rose-700">{message}</p>
      </div>
    </div>
  );
}
