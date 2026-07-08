import UserTable from "@/components/admin/UserTable";
import { adminUserServerService } from "@/services/server/admin/adminUser.service";

export default async function UsersPage() {
  const initialData = await adminUserServerService.getUsers({
    skip: 0,
    limit: 10,
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>

        <p className="text-sm text-slate-500 font-medium">
          View and manage NutriWise community members.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <UserTable initialData={initialData} limit={10} />
      </div>
    </div>
  );
}
