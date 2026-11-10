"use client";

import { useEffect, type ReactNode } from "react";

interface ConfirmDialogProps {
  title: string;
  description: ReactNode;
  confirmLabel: string;
  variant?: "danger" | "success";
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  variant = "danger",
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-sm rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-xl shadow-admin-text/10"
      >
        <h2
          id="confirm-dialog-title"
          className="text-lg font-bold text-admin-text"
        >
          {title}
        </h2>

        <p className="mt-2 text-sm font-medium text-admin-muted">
          {description}
        </p>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`flex-1 rounded-xl bg-admin-surface-hover px-4 py-2.5 text-sm font-bold text-admin-muted transition-colors hover:bg-admin-border disabled:opacity-50 ${focusRing}`}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 ${focusRing} ${
              variant === "danger" ? "bg-admin-danger" : "bg-admin-success"
            }`}
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}