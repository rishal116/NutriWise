import type { Metadata } from "next";

import ChallengeDayForm from "@/components/admin/challenge-day/ChallengeDayForm";

interface CreateChallengeDayPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Create Challenge Day | NutriWise Admin",
  description: "Create a new day for a NutriWise challenge.",
};

export default async function CreateChallengeDayPage({
  params,
}: CreateChallengeDayPageProps) {
  const { challengeId } = await params;

  return <ChallengeDayForm mode="create" challengeId={challengeId} />;
}
