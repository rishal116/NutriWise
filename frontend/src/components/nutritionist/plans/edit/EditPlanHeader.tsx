"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditPlanHeaderProps {
  planId: string;
  isSubmitting: boolean;
  onSave: () => void;
}

export default function EditPlanHeader({
  planId,
  isSubmitting,
  onSave,
}: EditPlanHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 mb-8 border-b border-slate-200 bg-slate-50/90 py-6 backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-400 shadow-sm transition-colors hover:text-emerald-600"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Plan
            </h1>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              ID: {planId}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}

          {isSubmitting ? "Saving" : "Save Changes"}
        </button>
      </div>
    </header>
  );
}
