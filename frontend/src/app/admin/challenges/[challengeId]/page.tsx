import ChallengeDetails from "@/components/admin/challenge/ChallengeDetails";

interface AdminChallengeDetailsPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function AdminChallengeDetailsPage({
  params,
}: AdminChallengeDetailsPageProps) {
  const { challengeId } = await params;

  return (
    <ChallengeDetails challengeId={challengeId} />
  );
}