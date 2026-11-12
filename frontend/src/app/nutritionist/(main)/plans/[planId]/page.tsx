import type { Metadata } from "next";

import ViewPlanClient from "@/components/nutritionist/plans/view/ViewPlanClient";

interface ViewPlanPageProps {
  params: Promise<{
    planId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Plan Details | NutriWise",
  description: "View and manage your nutrition coaching plan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ViewPlanPage({ params }: ViewPlanPageProps) {
  const { planId } = await params;

  return <ViewPlanClient planId={planId} />;
}
