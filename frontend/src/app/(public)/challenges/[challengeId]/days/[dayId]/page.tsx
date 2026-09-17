import { ChallengeDayDetails } from "@/components/public/challenge-day/challengeDayDetails";

interface ChallengeDayDetailsPageProps {
  params: Promise<{
    challengeId: string;
    dayId: string;
  }>;
}

export default async function ChallengeDayDetailsPage({
  params,
}: ChallengeDayDetailsPageProps) {
  const { challengeId, dayId } = await params;

  return <ChallengeDayDetails challengeId={challengeId} dayId={dayId} />;
}
