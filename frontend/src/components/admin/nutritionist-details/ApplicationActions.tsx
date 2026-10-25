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
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-emerald-400 sm:w-auto sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Reason for rejection..."
            aria-label="Reason for rejection"
            className="min-w-0 bg-transparent px-3 py-2 text-sm font-medium outline-none placeholder:text-slate-400 sm:w-64"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsRejecting(false)}
              disabled={isLoading}
              className="flex-1 rounded-lg px-3 py-2 text-xs font-bold text-slate-500 transition hover:text-slate-700 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim()}
              className="flex flex-1 items-center justify-center rounded-lg bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50 sm:flex-none"
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
          className="flex items-center gap-2 rounded-xl bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
        >
          <XCircle size={16} />
          {status === "rejected" ? "Update reason" : "Reject"}
        </button>
      )}

      <button
        type="button"
        onClick={onApprove}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-700 disabled:opacity-60"
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