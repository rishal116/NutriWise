
"use client";

import { ArrowLeft, Loader2, Pencil, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

interface SessionDetailsHeaderProps {
  session: NutriSessionDetailsResponseDTO;
  publishing: boolean;
  deleting: boolean;
  onPublish: () => void;
  onDelete: () => void;
}

export default function SessionDetailsHeader({
  session,
  publishing,
  deleting,
  onPublish,
  onDelete,
}: SessionDetailsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-600 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
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
          className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 md:flex-none"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>

        {session.status === "draft" && (
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing || deleting}
            className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 disabled:pointer-events-none disabled:opacity-50 md:flex-none"
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
          onClick={onDelete}
          disabled={deleting || publishing}
          className="inline-flex flex-auto items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-xs transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:pointer-events-none disabled:opacity-50 md:flex-none"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
