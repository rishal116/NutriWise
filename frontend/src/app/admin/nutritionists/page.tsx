import NutritionistTable from "@/components/admin/NutritionistTable";

export const metadata = {
  title: "Admin – Nutritionists",
  description: "Manage professional nutritionist profiles and approvals",
};

export default function NutritionistsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nutritionists</h1>
        <p className="text-sm text-slate-500 font-medium">
          Manage professional profiles, verify credentials, and control account access.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <NutritionistTable />
      </div>
    </div>
  );
}