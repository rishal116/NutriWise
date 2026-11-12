import { PlanDayDetailsClient } from "@/components/nutritionist/plan-days/details/PlanDayDetailsClient";

interface PlanDayDetailsPageProps {
  params: Promise<{
    planId: string;
    dayNumber: string;
  }>;
}

export default async function PlanDayDetailsPage({
  params,
}: PlanDayDetailsPageProps) {
  const { planId, dayNumber } = await params;

  return (
    <PlanDayDetailsClient
      planId={planId}
      dayNumber={dayNumber}
    />
  );
}