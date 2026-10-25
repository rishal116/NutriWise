import type { Metadata } from "next";

import ChallengeDayDetailsClient from "@/components/admin/challenge-day/ChallengeDayDetailsClient";

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

  return <ChallengeDayDetailsClient challengeId={challengeId} dayId={dayId} />;
}
