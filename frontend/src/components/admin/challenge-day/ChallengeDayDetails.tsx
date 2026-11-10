"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, ListChecks, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { AdminChallengeDayDetailsDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-details.dto";
import type { ChallengeActivityValueType } from "@/types/admin/challenge-day/challenge-day.types";
import { adminChallengeDayService } from "@/services/admin/admin-challenge-day.service";
import ConfirmDialog from "@/components/admin/common/ConfirmDialog";

interface ChallengeDayDetailsProps {
  challengeId: string;
  day: AdminChallengeDayDetailsDTO;
}

const VALUE_TYPE_LABELS: Record<ChallengeActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const cardClass =
  "rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5";

const sectionLabel =
  "text-xs font-bold uppercase tracking-wider text-admin-muted";

export default function ChallengeDayDetails({
  challengeId,
  day,
}: ChallengeDayDetailsProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await adminChallengeDayService.deleteDay(challengeId, day.id);

      toast.success("Challenge day deleted successfully.");

      router.push(`/admin/challenges/${challengeId}/days`);

      router.refresh();
    } catch (error) {
      console.error("Failed to delete challenge day:", error);

      toast.error("Failed to delete challenge day. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };

  const activityCount = day.activities.length;

  return (
    <div className="mx-auto max-w-5xl pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/challenges/${challengeId}/days`}
          className={`inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-admin-muted transition-colors hover:text-admin-accent ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Challenge Days
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/challenges/${challengeId}/days/${day.id}/edit`}
            className={`inline-flex items-center gap-1.5 rounded-xl border border-admin-border bg-admin-surface px-4 py-2.5 text-sm font-semibold text-admin-text shadow-sm shadow-admin-text/5 transition-colors hover:bg-admin-surface-hover hover:text-admin-accent ${focusRing}`}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 rounded-xl bg-admin-danger px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <section className={`mt-6 p-5 sm:p-6 ${cardClass}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center rounded-lg bg-admin-pastel-green px-3 py-1.5 text-xs font-bold text-admin-accent">
              Day {day.dayNumber}
            </span>

            <h1 className="mt-3 text-2xl font-bold text-admin-text">
              {day.title || "Untitled Day"}
            </h1>

            {day.description && (
              <p className="mt-3 max-w-3xl text-sm leading-6 text-admin-muted">
                {day.description}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-xl bg-admin-surface-hover px-4 py-3">
            <p className="text-xs font-medium text-admin-muted">
              {activityCount} {activityCount === 1 ? "activity" : "activities"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-admin-pastel-green text-admin-accent">
            <ListChecks className="h-4 w-4" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-admin-text">Activities</h2>

            <p className="text-sm text-admin-muted">
              Activities participants need to complete for this day.
            </p>
          </div>
        </div>

        {activityCount === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-admin-border bg-admin-surface px-6 py-12 text-center">
            <p className="text-sm font-semibold text-admin-text">
              No activities added
            </p>

            <p className="mt-1 text-xs text-admin-muted">
              Edit this day to add activities.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {day.activities.map((activity, index) => (
              <article
                key={activity.id}
                className={`overflow-hidden ${cardClass}`}
              >
                <div className="border-b border-admin-border px-5 py-4 sm:px-6">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-admin-bg text-xs font-bold text-admin-muted">
                      {index + 1}
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-admin-text">
                          {activity.title}
                        </h3>

                        <span className="rounded-full bg-admin-pastel-green px-2.5 py-1 text-[11px] font-bold capitalize text-admin-accent">
                          {activity.type.replaceAll("_", " ")}
                        </span>

                        {activity.isRequired && (
                          <span className="rounded-full bg-admin-warning/15 px-2.5 py-1 text-[11px] font-bold text-admin-warning">
                            Required
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs font-medium text-admin-muted">
                        Response: {VALUE_TYPE_LABELS[activity.valueType]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                  <div className="space-y-4">
                    {activity.description && (
                      <div>
                        <h4 className={sectionLabel}>Description</h4>

                        <p className="mt-1.5 text-sm leading-6 text-admin-text">
                          {activity.description}
                        </p>
                      </div>
                    )}

                    {activity.instructions && (
                      <div>
                        <h4 className={sectionLabel}>Instructions</h4>

                        <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-admin-text">
                          {activity.instructions}
                        </p>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {activity.targetValue != null && (
                        <div className="rounded-xl bg-admin-pastel-blue px-4 py-3">
                          <p className={sectionLabel}>Target</p>

                          <p className="mt-1 text-sm font-bold text-admin-text">
                            {activity.targetValue}
                            {activity.unit ? ` ${activity.unit}` : ""}
                          </p>
                        </div>
                      )}

                      {activity.estimatedDurationMinutes != null && (
                        <div className="rounded-xl bg-admin-pastel-green px-4 py-3">
                          <p className={sectionLabel}>Duration</p>

                          <p className="mt-1 text-sm font-bold text-admin-text">
                            {activity.estimatedDurationMinutes} min
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(activity.imageUrl || activity.videoUrl) && (
                    <div className="space-y-4">
                      {activity.imageUrl && (
                        <div>
                          <p className={`mb-2 ${sectionLabel}`}>
                            Activity Image
                          </p>

                          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-admin-border bg-admin-bg">
                            <Image
                              src={activity.imageUrl}
                              alt={activity.title}
                              fill
                              unoptimized
                              className="object-contain"
                            />
                          </div>
                        </div>
                      )}

                      {activity.videoUrl && (
                        <div>
                          <p className={`mb-2 ${sectionLabel}`}>
                            Activity Video
                          </p>

                          <div className="overflow-hidden rounded-xl border border-admin-border bg-black">
                            <video
                              src={activity.videoUrl}
                              controls
                              preload="metadata"
                              playsInline
                              className="aspect-video w-full object-contain"
                            >
                              Your browser does not support video playback.
                            </video>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {isConfirmOpen && (
        <ConfirmDialog
          title={`Delete Day ${day.dayNumber}?`}
          description="This will also remove its activities and media. This action cannot be undone."
          confirmLabel="Yes, Delete"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </div>
  );
}
