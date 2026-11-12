import type { Metadata } from "next";

import EditPlanClient from "@/components/nutritionist/plans/edit/EditPlanClient";

interface EditPlanPageProps {
  params: Promise<{ planId: string }>;
}

export const metadata: Metadata = {
  title: "Edit Nutrition Plan | NutriWise",
  description: "Update your nutrition coaching plan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { planId } = await params;

  return <EditPlanClient planId={planId} />;
}
