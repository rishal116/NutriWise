
"use client";

import { Archive, Globe } from "lucide-react";
import { useState } from "react";

import type { PlanStatus } from "@/types/plan.types";

import PlanStatusConfirmDialog from "./PlanStatusConfirmDialog";

interface PlanStatusActionsProps {
  status: PlanStatus;
  loading: boolean;
  onStatusChange: (status: PlanStatus) => Promise<boolean>;
}

export default function PlanStatusActions({
  status,
  loading,
  onStatusChange,
}: PlanStatusActionsProps) {
  const [confirmStatus, setConfirmStatus] = useState<PlanStatus | null>(null);

  const isPublished = status === "published";

  const handleConfirm = async () => {
    if (!confirmStatus || loading) return;

    const success = await onStatusChange(confirmStatus);

    if (success) {
      setConfirmStatus(null);
    }
  };

  const handleCancel = () => {
    if (loading) return;

    setConfirmStatus(null);
  };

  return (
    <>
      <div>
        {!isPublished ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirmStatus("published")}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Globe size={16} />
            {status === "archived" ? "Publish Again" : "Publish Plan"}
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => setConfirmStatus("archived")}
            className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-700 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Archive size={16} />
            Archive Plan
          </button>
        )}
      </div>

      {confirmStatus && (
        <PlanStatusConfirmDialog
          status={confirmStatus}
          loading={loading}
          onCancel={handleCancel}
          onConfirm={() => void handleConfirm()}
        />
      )}
    </>
  );
}
