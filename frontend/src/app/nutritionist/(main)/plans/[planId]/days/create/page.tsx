import type { Metadata } from "next";
import CreatePlanDayClient from "@/components/nutritionist/plan-days/create/CreatePlanDayClient";

interface CreatePlanDayPageProps {
  params: Promise<{ planId: string }>;
}

export const metadata: Metadata = {
  title: "Create Plan Day | NutriWise",
  description: "Create and manage a nutrition plan day.",
  robots: { index: false, follow: false },
};

export default async function CreatePlanDayPage({
  params,
}: CreatePlanDayPageProps) {
  const { planId } = await params;

  return <CreatePlanDayClient planId={planId} />;
}