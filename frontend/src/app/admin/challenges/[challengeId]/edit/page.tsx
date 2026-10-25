
import type { Metadata } from "next";
import ChallengeEditClient from "@/components/admin/challenge/ChallengeEditClient";

interface ChallengeEditPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Challenge | NutriWise Admin",
  description: "Edit and manage a NutriWise health challenge.",
};

export default async function AdminChallengeEditPage({
  params,
}: ChallengeEditPageProps) {
  const { challengeId } = await params;

  return <ChallengeEditClient challengeId={challengeId} />;
}
