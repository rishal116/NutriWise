import type { Metadata } from "next";

import PlanDaysClient from "@/components/nutritionist/plan-days/list/PlanDaysClient";

interface PlanDaysPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Plan Days | NutriWise",
  description: "View and manage your nutrition coaching plan days.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PlanDaysPage({ params }: PlanDaysPageProps) {
  const { planId } = await params;

  return <PlanDaysClient planId={planId} />;
}
