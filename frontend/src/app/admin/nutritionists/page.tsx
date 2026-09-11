import type { Metadata } from "next";

import NutritionistTable from "@/components/admin/NutritionistTable";

import { adminNutritionistServerService } from "@/services/server/admin/adminNutriServer.service";

export const metadata: Metadata = {
  title: "Nutritionists | NutriWise Admin",
  description:
    "Manage professional nutritionist profiles, verify credentials, and control account access.",
};

export default async function NutritionistsPage() {
  const initialData = await adminNutritionistServerService.getNutritionists({
    limit: 10,
    sortBy: "newest",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nutritionists</h1>

        <p className="text-sm font-medium text-slate-500">
          Manage professional profiles, verify credentials, and control account
          access.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <NutritionistTable initialData={initialData} />
      </div>
    </div>
  );
}
