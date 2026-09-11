import type { Metadata } from "next";

import ChallengeDayForm from "@/components/admin/challenge-day/ChallengeDayForm";

import { adminChallengeDayServerService } from "@/services/server/admin/adminChallengeDayServer.service";

interface EditChallengeDayPageProps {
  params: Promise<{
    challengeId: string;
    dayId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Challenge Day | NutriWise Admin",
  description: "Edit an existing challenge day.",
};

export default async function EditChallengeDayPage({
  params,
}: EditChallengeDayPageProps) {
  const { challengeId, dayId } = await params;

  const response = await adminChallengeDayServerService.getDayDetails(
    challengeId,
    dayId,
  );

  return (
    <ChallengeDayForm
      mode="edit"
      challengeId={challengeId}
      dayId={dayId}
      initialValues={{
        dayNumber: response.dayNumber,
        title: response.title ?? "",
        description: response.description ?? "",
        activities: response.activities,
      }}
    />
  );
}
