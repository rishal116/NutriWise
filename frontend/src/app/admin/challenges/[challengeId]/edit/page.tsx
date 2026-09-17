import type { Metadata } from "next";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import ChallengeForm from "@/components/admin/challenge/ChallengeForm";

import { adminChallengeServerService } from "@/services/server/admin/adminChallengeServer.service";

interface ChallengeEditPageProps {
  params: Promise<{
    challengeId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Edit Challenge | NutriWise Admin",
  description:
    "Edit and manage a NutriWise health challenge.",
};

export default async function AdminChallengeEditPage({
  params,
}: ChallengeEditPageProps) {
  const { challengeId } = await params;

  const challenge =
    await adminChallengeServerService.getChallengeDetails(
      challengeId,
    );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href={`/admin/challenges/${challengeId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Challenge
        </Link>

        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Challenge
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Update the details and configuration of this
            challenge.
          </p>
        </div>

        <ChallengeForm
          mode="edit"
          challengeId={challengeId}
          initialValues={{
            title: challenge.title,
            description: challenge.description,
            instructions: challenge.instructions,
            thumbnailUrl:
              challenge.thumbnailUrl,
            coverImageUrl:
              challenge.coverImageUrl,
            category: challenge.category,
            difficulty: challenge.difficulty,
            accessType: challenge.accessType,
            durationDays: challenge.durationDays,
          }}
        />
      </div>
    </div>
  );
}