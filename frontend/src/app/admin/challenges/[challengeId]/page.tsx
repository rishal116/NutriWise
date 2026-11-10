import dynamic from "next/dynamic";

function ChallengeDetailsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading challenge details"
      className="mx-auto max-w-6xl animate-pulse space-y-6"
    >
      <div className="h-5 w-32 rounded bg-admin-border" />
      <div className="h-56 rounded-2xl border border-admin-border bg-admin-surface" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="h-64 rounded-2xl border border-admin-border bg-admin-surface" />
          <div className="h-48 rounded-2xl border border-admin-border bg-admin-surface" />
        </div>
        <div className="h-72 rounded-2xl border border-admin-border bg-admin-surface" />
      </div>
    </div>
  );
}

// Loaded as a separate chunk; the skeleton shows while it downloads.
const ChallengeDetails = dynamic(
  () => import("@/components/admin/challenge-details/ChallengeDetails"),
  { loading: () => <ChallengeDetailsSkeleton /> },
);

interface AdminChallengeDetailsPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export default async function AdminChallengeDetailsPage({
  params,
}: AdminChallengeDetailsPageProps) {
  const { challengeId } = await params;

  return <ChallengeDetails challengeId={challengeId} />;
}
