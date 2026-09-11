import type { Metadata } from "next";

import ChallengeDayDetails from "@/components/admin/challenge-day/ChallengeDayDetails";

import { adminChallengeDayServerService } from "@/services/server/admin/adminChallengeDayServer.service";

interface ChallengeDayDetailsPageProps {
  params: Promise<{
    challengeId: string;
    dayId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Challenge Day | NutriWise Admin",
  description: "View and manage challenge day details and activities.",
};

export default async function ChallengeDayDetailsPage({
  params,
}: ChallengeDayDetailsPageProps) {
  const { challengeId, dayId } = await params;

  const day = await adminChallengeDayServerService.getDayDetails(
    challengeId,
    dayId,
  );

  return <ChallengeDayDetails challengeId={challengeId} day={day} />;
}
