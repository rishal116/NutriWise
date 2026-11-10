"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import type { ApplicationStatus } from "@/types/nutritionist.types";

interface ApplicationActionsProps {
  status: ApplicationStatus;
  rejectionReason?: string;
  isLoading: boolean;
  onApprove: () => void;
  /** Resolves true when the rejection succeeded. */
  onReject: (reason: string) => Promise<boolean>;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const DANGER_BUTTON =
  "bg-admin-danger-soft text-admin-danger transition-colors hover:bg-admin-danger/15 disabled:opacity-50";

export default function ApplicationActions({
  status,
  rejectionReason,
  isLoading,
  onApprove,
  onReject,
}: ApplicationActionsProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (status !== "pending" && status !== "rejected") return null;

  const startRejecting = () => {
    setReason(rejectionReason ?? "");
    setIsRejecting(true);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (await onReject(reason.trim())) setIsRejecting(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {isRejecting ? (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex w-full flex-col gap-2 rounded-xl border border-admin-border bg-admin-surface p-1.5 shadow-sm shadow-admin-text/5 transition-colors focus-within:border-admin-accent sm:w-auto sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for rejection..."
            aria-label="Reason for rejection"
            className="min-w-0 bg-transparent px-3 py-2 text-sm font-medium text-admin-text outline-none placeholder:text-admin-muted sm:w-64"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsRejecting(false)}
              disabled={isLoading}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold text-admin-muted transition-colors hover:text-admin-text disabled:opacity-50 sm:flex-none ${FOCUS_RING}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className={`flex flex-1 items-center justify-center rounded-lg px-4 py-2 text-xs font-bold sm:flex-none ${DANGER_BUTTON} ${FOCUS_RING}`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={startRejecting}
          disabled={isLoading}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold ${DANGER_BUTTON} ${FOCUS_RING}`}
        >
          <XCircle size={16} />
          {status === "rejected" ? "Update reason" : "Reject"}
        </button>
      )}

      <button
        type="button"
        onClick={onApprove}
        disabled={isLoading}
        className={`flex items-center gap-2 rounded-xl bg-admin-accent px-5 py-2.5 text-sm font-bold text-admin-accent-fg transition-colors hover:bg-admin-accent-hover disabled:opacity-60 ${FOCUS_RING}`}
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CheckCircle2 size={16} />
        )}
        Approve
      </button>
    </div>
  );
}