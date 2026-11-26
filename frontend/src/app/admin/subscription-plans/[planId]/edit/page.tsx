
import type { Metadata } from "next";

import SubscriptionPlanEditClient from "@/components/admin/subscription-plan/edit/SubscriptionPlanEditClient";

interface SubscriptionPlanEditPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Subscription Plan | NutriWise Admin",
  description: "Edit and manage NutriWise subscription plan configuration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SubscriptionPlanEditPage({
  params,
}: SubscriptionPlanEditPageProps) {
  const { planId } = await params;

  return <SubscriptionPlanEditClient planId={planId} />;
}
