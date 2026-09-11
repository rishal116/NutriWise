"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, ListChecks, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { AdminChallengeDayDetailsDTO } from "@/dtos/admin/challenge-day/admin-challenge-day-details.dto";
import { adminChallengeDayService } from "@/services/admin/adminChallengeDay.service";

interface ChallengeDayDetailsProps {
  challengeId: string;
  day: AdminChallengeDayDetailsDTO;
}

export default function ChallengeDayDetails({
  challengeId,
  day,
}: ChallengeDayDetailsProps) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Day ${day.dayNumber}? This will also remove its activities and media.`,
    );

    if (!confirmed) {
      return;
    }

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
    }
  };

  const createdDate = new Date(day.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const updatedDate = new Date(day.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/admin/challenges/${challengeId}/days`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenge Days
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/challenges/${challengeId}/days/${day.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                Day {day.dayNumber}
              </span>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {day.title || "Untitled Day"}
              </h1>

              {day.description && (
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  {day.description}
                </p>
              )}
            </div>

            <div className="shrink-0 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-400">
                {day.activities.length}{" "}
                {day.activities.length === 1 ? "activity" : "activities"}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-400">
                Updated {updatedDate}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 border-t border-slate-100 pt-5 text-xs font-medium text-slate-400 sm:grid-cols-2">
            <p>Created {createdDate}</p>
            <p className="sm:text-right">Last updated {updatedDate}</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <ListChecks className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Activities</h2>

              <p className="text-sm text-slate-500">
                Activities participants need to complete for this day.
              </p>
            </div>
          </div>

          {day.activities.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-600">
                No activities added
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Edit this day to add activities.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              {day.activities.map((activity, index) => (
                <article
                  key={activity.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                          {index + 1}
                        </span>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {activity.title}
                            </h3>

                            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold capitalize text-teal-700">
                              {activity.type.replaceAll("_", " ")}
                            </span>

                            {activity.isRequired && (
                              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                Required
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-medium text-slate-400">
                            Response:{" "}
                            {activity.valueType === "boolean"
                              ? "Yes / No"
                              : activity.valueType === "number"
                                ? "Number"
                                : "Duration"}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-bold text-slate-400">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      {activity.description && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Description
                          </h4>

                          <p className="mt-1.5 text-sm leading-6 text-slate-600">
                            {activity.description}
                          </p>
                        </div>
                      )}

                      {activity.instructions && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Instructions
                          </h4>

                          <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-600">
                            {activity.instructions}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-3 sm:grid-cols-2">
                        {activity.targetValue !== undefined && (
                          <div className="rounded-xl bg-slate-50 px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Target
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
                              {activity.targetValue}
                              {activity.unit ? ` ${activity.unit}` : ""}
                            </p>
                          </div>
                        )}

                        {activity.estimatedDurationMinutes !== undefined && (
                          <div className="rounded-xl bg-slate-50 px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              Duration
                            </p>

                            <p className="mt-1 text-sm font-bold text-slate-800">
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
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Activity Image
                            </p>

                            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
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
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                              Activity Video
                            </p>

                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
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
      </div>
    </div>
  );
}
