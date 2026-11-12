
"use client";

import { Archive, Globe, Loader2, X } from "lucide-react";

import type { PlanStatus } from "@/types/plan.types";

interface PlanStatusConfirmDialogProps {
  status: PlanStatus;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function PlanStatusConfirmDialog({
  status,
  loading,
  onCancel,
  onConfirm,
}: PlanStatusConfirmDialogProps) {
  const isPublishing = status === "published";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-status-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isPublishing
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {isPublishing ? <Globe size={22} /> : <Archive size={22} />}
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="plan-status-dialog-title"
          className="text-lg font-bold text-slate-900"
        >
          {isPublishing ? "Publish this plan?" : "Archive this plan?"}
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {isPublishing
            ? "Your plan will become available to clients in the marketplace. Are you sure you want to continue?"
            : "Your plan will no longer be available to clients in the marketplace. You can publish it again later."}
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              isPublishing
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isPublishing ? <Globe size={16} /> : <Archive size={16} />}
                {isPublishing ? "Yes, Publish" : "Yes, Archive"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
