import type { Metadata } from "next";

import ChallengeDayList from "@/components/admin/challenge-day/ChallengeDayList";

import { adminChallengeDayServerService } from "@/services/server/admin/adminChallengeDayServer.service";

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
  const initialData = await adminChallengeDayServerService.listDays(
    challengeId,
    {
      limit: 12,
      sortBy: "day_asc",
    },
  );

  return (
    <ChallengeDayList challengeId={challengeId} initialData={initialData} />
  );
}
