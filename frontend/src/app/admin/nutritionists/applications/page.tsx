import ApplicationTable from "@/components/admin/nutri-application/ApplicationTable";

export default async function ApplicationsPage() {
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
        <ApplicationTable  />
      </div>
    </div>
  );
}
