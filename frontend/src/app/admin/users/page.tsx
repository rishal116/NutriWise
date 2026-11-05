import { Suspense } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";

import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

// Code-split: the table JS loads after the page shell is already visible.
const UserTable = dynamic(() => import("@/components/admin/user/UserTable"));

export const metadata: Metadata = {
  title: "User Management | Admin | NutriWise",
  robots: { index: false, follow: false },
};

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">User Management</h1>
        <p className="text-sm font-medium text-admin-muted">
          View and manage NutriWise community members.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5">
        <Suspense fallback={<AdminTableSkeleton />}>
          <UserTable />
        </Suspense>
      </div>
    </div>
  );
}