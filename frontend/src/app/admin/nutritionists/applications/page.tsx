import { Suspense } from "react";
import dynamic from "next/dynamic";

import AdminTableSkeleton from "@/components/admin/AdminTableSkeleton";

// Code-split: the table JS loads after the page shell is already visible.
const ApplicationTable = dynamic(
  () => import("@/components/admin/nutri-application/ApplicationTable"),
);

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-admin-text">
          Nutritionist Applications
        </h1>

        <p className="text-sm font-medium text-admin-muted">
          Review and manage incoming nutritionist applications.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5">
        <Suspense fallback={<AdminTableSkeleton />}>
          <ApplicationTable />
        </Suspense>
      </div>
    </div>
  );
}
