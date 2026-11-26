import type { Metadata } from "next";

import SubscriptionPlanDetailsClient from "@/components/admin/subscription-plan/details/SubscriptionPlanDetailsClient";

interface SubscriptionPlanDetailsPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Subscription Plan Details | NutriWise Admin",
  description: "View and manage NutriWise subscription plan details.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SubscriptionPlanDetailsPage({
  params,
}: SubscriptionPlanDetailsPageProps) {
  const { planId } = await params;

  return <SubscriptionPlanDetailsClient planId={planId} />;
}
