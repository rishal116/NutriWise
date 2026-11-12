import { PlusCircle, Save } from "lucide-react";

interface CreatePlanHeaderProps {
  isSubmitting: boolean;
  onSaveDraft: () => void;
}

export default function CreatePlanHeader({
  isSubmitting,
  onSaveDraft,
}: CreatePlanHeaderProps) {
  return (
    <div className="mt-6 flex flex-col justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:flex-row md:items-center">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
          <PlusCircle className="h-8 w-8 text-emerald-600" />
          Create New Plan
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Design your professional nutrition program.
        </p>
      </div>

      <button
        type="button"
        onClick={onSaveDraft}
        disabled={isSubmitting}
        className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Save size={18} className="mr-2 inline" />
        {isSubmitting ? "Saving..." : "Save as Draft"}
      </button>
    </div>
  );
}