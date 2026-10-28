
import type { Metadata } from "next";

import AdminPayments from "@/components/admin/payments/AdminPayments";

export const metadata: Metadata = {
  title: "Payments & Wallets | NutriWise Admin",
  description: "Manage payments, financial statistics, and wallets.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Payments & Wallets
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor payments, revenue, refunds, and wallet transactions.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <AdminPayments />
      </div>
    </div>
  );
}
