"use client";

import Image from "next/image";
import { useState } from "react";

import {
  BookOpen,
  Check,
  Clock3,
  Dumbbell,
  Droplets,
  HeartPulse,
  Loader2,
  Moon,
  Sparkles,
} from "lucide-react";

import { userChallengeTrackingService } from "@/services/user/userChallengeTracking.service";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import { UserChallengeDayDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import { UserChallengeActivityDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

interface UserChallengeActivityCardProps {
  userChallengeId: string;
  challenge: UserChallengeDetailsDTO;
  day: UserChallengeDayDTO;
  activity: UserChallengeActivityDTO;
  onChallengeUpdate: (challenge: UserChallengeDetailsDTO) => void;
}

const ACTIVITY_ICONS = {
  exercise: Dumbbell,
  nutrition: HeartPulse,
  hydration: Droplets,
  meditation: Sparkles,
  breathing: Sparkles,
  sleep: Moon,
  habit: Check,
  education: BookOpen,
  stretching: Dumbbell,
  recovery: HeartPulse,
  measurement: Sparkles,
  custom: Sparkles,
} as const;

export default function UserChallengeActivityCard({
  userChallengeId,
  challenge,
  day,
  activity,
  onChallengeUpdate,
}: UserChallengeActivityCardProps) {
  const [updating, setUpdating] = useState(false);

  const Icon = ACTIVITY_ICONS[activity.type] ?? Sparkles;

  const handleToggle = async () => {
    if (updating) {
      return;
    }

    try {
      setUpdating(true);

      const response = activity.completed
        ? await userChallengeTrackingService.uncompleteActivity(
            userChallengeId,
            day.id,
            activity.id,
          )
        : await userChallengeTrackingService.completeActivity(
            userChallengeId,
            day.id,
            activity.id,
          );

      onChallengeUpdate(response.data);
    } catch (error) {
      console.error("Failed to update activity:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <article
      className={`rounded-2xl border p-4 transition sm:p-5 ${
        activity.completed
          ? "border-emerald-200 bg-emerald-50/50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex gap-4">
        {activity.imageUrl ? (
          <div className="relative hidden h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:block">
            <Image
              src={activity.imageUrl}
              alt={activity.title}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        ) : (
          <div
            className={`hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl sm:flex ${
              activity.completed ? "bg-emerald-100" : "bg-slate-100"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                activity.completed ? "text-emerald-600" : "text-slate-500"
              }`}
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold capitalize text-emerald-600">
                  {activity.type.replace("_", " ")}
                </span>

                {activity.isRequired && (
                  <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                    Required
                  </span>
                )}
              </div>

              <h3
                className={`mt-1 text-base font-bold ${
                  activity.completed
                    ? "text-emerald-900 line-through decoration-emerald-300"
                    : "text-slate-900"
                }`}
              >
                {activity.title}
              </h3>

              {activity.description && (
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {activity.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleToggle}
              disabled={updating}
              aria-label={
                activity.completed
                  ? `Mark ${activity.title} as incomplete`
                  : `Mark ${activity.title} as completed`
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                activity.completed
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-300 bg-white text-slate-400 hover:border-emerald-400 hover:text-emerald-500"
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {activity.estimatedDurationMinutes && (
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <Clock3 className="h-3.5 w-3.5" />
                {activity.estimatedDurationMinutes} min
              </div>
            )}

            {activity.targetValue !== undefined && (
              <div className="text-xs text-slate-500">
                Target:{" "}
                <span className="font-semibold text-slate-700">
                  {activity.targetValue}
                  {activity.unit ? ` ${activity.unit}` : ""}
                </span>
              </div>
            )}

            {activity.completed && (
              <span className="text-xs font-semibold text-emerald-600">
                Completed
              </span>
            )}
          </div>

          {activity.instructions && (
            <div className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-600">
              {activity.instructions}
            </div>
          )}

          {activity.videoUrl && (
            <a
              href={activity.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Watch activity video
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
