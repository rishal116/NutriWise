import NutritionistTable from "@/components/admin/NutritionistTable";
import { Stethoscope } from "lucide-react";

export const metadata = {
  title: "Admin – Nutritionists",
  description: "Manage professional nutritionist profiles and approvals",
};

export default function NutritionistsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
            Nutritionists
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage professional profiles, verify credentials, and control account access.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <Stethoscope size={13} strokeWidth={2} className="text-teal-400" />
          Professional Registry
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <NutritionistTable />
      </div>
    </div>
  );
}