// app/admin/nutritionists/applications/page.tsx
import NutritionistApplicationsTable from "@/components/admin/NutritionistApplicationsTable";
import { FileCheck } from "lucide-react";

export const metadata = {
  title: "Admin – Nutritionist Applications",
  description: "Review pending and rejected nutritionist applications",
};

export default function NutritionistApplicationsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
            Nutritionist Applications
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review pending applications, rejected submissions, and approve qualified professionals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <FileCheck size={13} strokeWidth={2} className="text-amber-500" />
          Application Review
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <NutritionistApplicationsTable />
      </div>
    </div>
  );
}