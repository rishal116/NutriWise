import ApplicationTable from "@/components/admin/ApplicationTable";
import { adminNutritionistApplicationServerService } from "@/services/server/admin/adminNutriApplication.service";

export default async function ApplicationsPage() {
  const initialData =
    await adminNutritionistApplicationServerService.getApplications({
      skip: 0,
      limit: 10,
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      applicationStatus: "pending",
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Nutritionist Applications
        </h1>

        <p className="text-sm text-slate-500 font-medium">
          Review and manage incoming nutritionist applications.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <ApplicationTable initialData={initialData} limit={10} />
      </div>
    </div>
  );
}