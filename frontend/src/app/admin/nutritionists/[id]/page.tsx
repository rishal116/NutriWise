"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import ApplicationActions from "@/components/admin/nutritionist-details/ApplicationActions";
import ApplicationStatusBanner from "@/components/admin/nutritionist-details/ApplicationStatusBanner";
import NutritionistAboutSection from "@/components/admin/nutritionist-details/NutritionistAboutSection";
import NutritionistDetailsError from "@/components/admin/nutritionist-details/NutritionistDetailsError";
import NutritionistDetailsSkeleton from "@/components/admin/nutritionist-details/NutritionistDetailsSkeleton";
import NutritionistDocumentsSection from "@/components/admin/nutritionist-details/NutritionistDocumentsSection";
import NutritionistExperienceSection from "@/components/admin/nutritionist-details/NutritionistExperienceSection";
import NutritionistProfileCard from "@/components/admin/nutritionist-details/NutritionistProfileCard";
import { useAdminNutritionistDetails } from "@/hooks/admin/useAdminNutritionistDetails.hooks";
import { useNutritionistActions } from "@/hooks/admin/useNutritionistActions.hooks";

export default function AdminNutritionistProfilePage() {
  const router = useRouter();
  const { id: userId } = useParams<{ id: string }>();

  const { details, error, isLoading, retry, refresh } =
    useAdminNutritionistDetails(userId);

  const {
    isUpdatingLevel,
    isActionLoading,
    updateCoachLevel,
    approve,
    reject,
  } = useNutritionistActions(userId, refresh);

  if (isLoading) return <NutritionistDetailsSkeleton />;
  if (error || !details) {
    return <NutritionistDetailsError error={error} onRetry={retry} />;
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-1.5 self-start text-sm font-semibold text-slate-500 transition-colors hover:text-emerald-600"
          >
            <ChevronLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back
          </button>

          <ApplicationActions
            status={details.applicationStatus}
            rejectionReason={details.rejectionReason}
            isLoading={isActionLoading}
            onApprove={approve}
            onReject={reject}
          />
        </header>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <NutritionistProfileCard
            details={details}
            isUpdatingLevel={isUpdatingLevel}
            onCoachLevelChange={updateCoachLevel}
          />

          <div className="min-w-0 space-y-6">
            <ApplicationStatusBanner
              status={details.applicationStatus}
              rejectionReason={details.rejectionReason}
            />
            <NutritionistAboutSection details={details} />
            <NutritionistExperienceSection experiences={details.experiences} />
            <NutritionistDocumentsSection details={details} />
          </div>
        </div>
      </div>
    </main>
  );
}
