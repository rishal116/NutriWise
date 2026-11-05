"use client";

import { useEffect } from "react";

interface ConfirmTarget {
  fullName: string;
  isBlocked: boolean;
}

interface ConfirmBlockDialogProps {
  user: ConfirmTarget;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

export default function ConfirmBlockDialog({
  user,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmBlockDialogProps) {
  const action = user.isBlocked ? "Unblock" : "Block";

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
        aria-labelledby="confirm-user-action-title"
        className="w-full max-w-sm rounded-2xl border border-admin-border bg-admin-surface p-6 shadow-xl shadow-admin-text/10"
      >
        <h2
          id="confirm-user-action-title"
          className="text-lg font-bold text-admin-text"
        >
          Confirm Action
        </h2>

        <p className="mt-2 text-sm font-medium text-admin-muted">
          Are you sure you want to {action.toLowerCase()}{" "}
          <span className="font-bold italic text-admin-text">
            {user.fullName}
          </span>
          ?
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
              user.isBlocked ? "bg-admin-success" : "bg-admin-danger"
            }`}
          >
            {isLoading ? "Please wait..." : `Yes, ${action}`}
          </button>
        </div>
      </div>
    </div>
  );
}