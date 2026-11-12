import { EditPlanDayClient } from "@/components/nutritionist/plan-days/edit/EditPlanDayClient";

interface EditPlanDayPageProps {
  params: Promise<{
    planId: string;
    dayNumber: string;
  }>;
}

export default async function EditPlanDayPage({
  params,
}: EditPlanDayPageProps) {
  const { planId, dayNumber } = await params;

  return (
    <EditPlanDayClient
      planId={planId}
      dayNumber={dayNumber}
    />
  );
}