import UserTable from "@/components/admin/UserTable";

import { adminUserServerService } from "@/services/server/admin/adminUserServer.service";

export default async function UsersPage() {
  const initialData = await adminUserServerService.getUsers({
    limit: 10,
    sortBy: "newest",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>

        <p className="text-sm font-medium text-slate-500">
          View and manage NutriWise community members.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <UserTable initialData={initialData} />
      </div>
    </div>
  );
}
