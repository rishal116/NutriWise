import type { Metadata } from "next";

import EditChallengeDayClient from "@/components/admin/challenge-day/EditChallengeDayClient";

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

  return (
    <EditChallengeDayClient
      challengeId={challengeId}
      dayId={dayId}
    />
  );
}