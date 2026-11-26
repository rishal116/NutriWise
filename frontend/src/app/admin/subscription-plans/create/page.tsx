import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Create Subscription Plan | NutriWise Admin",
  description: "Create a new NutriWise platform subscription plan.",
  robots: {
    index: false,
    follow: false,
  },
};

const SubscriptionPlanCreateForm = dynamic(
  () =>
    import("@/components/admin/subscription-plan/create/SubscriptionPlanCreateForm"),
  {
    loading: () => (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 rounded-lg bg-admin-surface-hover" />
        <div className="h-64 rounded-2xl bg-admin-surface-hover" />
        <div className="h-48 rounded-2xl bg-admin-surface-hover" />
      </div>
    ),
  },
);

export default function CreateSubscriptionPlanPage() {
  return <SubscriptionPlanCreateForm />;
}
