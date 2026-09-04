"use client";

import { Loader2, TriangleAlert, X } from "lucide-react";

interface DeletePostModalProps {
  open: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeletePostModal({ open, isDeleting, onCancel, onConfirm }: DeletePostModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100/80 text-rose-700">
            <TriangleAlert className="h-5 w-5" />
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="mt-3 text-base font-bold tracking-tight text-slate-900">
          Delete this post?
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500">
          This can&apos;t be undone. The post, its media, likes, and comments will be permanently removed.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-60"
          >
            {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}