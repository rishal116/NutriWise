import type { Metadata } from "next";
import UserTable from "@/components/admin/user/UserTable";

export const metadata: Metadata = {
  title: "User Management | Admin | NutriWise",
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm font-medium text-slate-500">
          View and manage NutriWise community members.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <UserTable />
      </div>
    </div>
  );
}
