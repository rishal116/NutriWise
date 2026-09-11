import type { Metadata } from "next";

import ApplicationTable from "@/components/admin/ApplicationTable";

import { adminNutritionistApplicationServerService } from "@/services/server/admin/adminNutriApplicationServer.service";

export const metadata: Metadata = {
  title: "Nutritionist Applications | NutriWise Admin",
  description: "Review and manage incoming nutritionist applications.",
};

export default async function ApplicationsPage() {
  const initialData =
    await adminNutritionistApplicationServerService.getApplications({
      limit: 10,
      sortBy: "newest",
      applicationStatus: "pending",
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Nutritionist Applications
        </h1>

        <p className="text-sm font-medium text-slate-500">
          Review and manage incoming nutritionist applications.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ApplicationTable initialData={initialData} />
      </div>
    </div>
  );
}
