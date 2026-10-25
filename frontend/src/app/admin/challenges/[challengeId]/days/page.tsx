import type { Metadata } from "next";

import ChallengeDaysClient from "@/components/admin/challenge-day/ChallengeDaysClient";

interface ChallengeDaysPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Challenge Days | NutriWise Admin",
  description: "Manage the days and activities included in this challenge.",
};

export default async function ChallengeDaysPage({
  params,
}: ChallengeDaysPageProps) {
  const { challengeId } = await params;

  return <ChallengeDaysClient challengeId={challengeId} />;
}