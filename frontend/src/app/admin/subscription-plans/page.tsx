import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Subscription Plans | NutriWise Admin",
  description:
    "Manage NutriWise platform subscription plans for users and nutritionists.",
  robots: {
    index: false,
    follow: false,
  },
};

const SubscriptionPlanList = dynamic(
  () =>
    import("@/components/admin/subscription-plan/list/SubscriptionPlanList"),
  {
    loading: () => (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl border border-admin-border bg-admin-surface"
          />
        ))}
      </div>
    ),
  },
);

export default function AdminSubscriptionPlansPage() {
  return <SubscriptionPlanList />;
}
