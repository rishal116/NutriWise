import { ChallengeDetails } from "@/components/public/challenge/ChallengeDetails";

interface ChallengeDetailsPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function ChallengeDetailsPage({
  params,
}: ChallengeDetailsPageProps) {
  const { challengeId } = await params;

  return <ChallengeDetails challengeId={challengeId} />;
}
