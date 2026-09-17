import {
  CheckCircle2,
  Flame,
  Target,
} from "lucide-react";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

interface UserChallengeProgressProps {
  challenge: UserChallengeDetailsDTO;
}

export default function UserChallengeProgress({
  challenge,
}: UserChallengeProgressProps) {
  const progress = Math.min(
    Math.max(challenge.progressPercentage, 0),
    100,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 lg:max-w-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Overall progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Keep going. Consistency is the goal.
              </p>
            </div>

            <span className="text-xl font-bold text-emerald-600">
              {progress}%
            </span>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="min-w-24 rounded-xl bg-slate-50 px-3 py-3 text-center">
            <Target className="mx-auto h-4 w-4 text-emerald-600" />
            <p className="mt-1 text-xs text-slate-500">Day</p>
            <p className="text-sm font-bold text-slate-900">
              {challenge.currentDay}
            </p>
          </div>

          <div className="min-w-24 rounded-xl bg-slate-50 px-3 py-3 text-center">
            <Flame className="mx-auto h-4 w-4 text-orange-500" />
            <p className="mt-1 text-xs text-slate-500">Streak</p>
            <p className="text-sm font-bold text-slate-900">
              {challenge.currentStreak}
            </p>
          </div>

          <div className="min-w-24 rounded-xl bg-slate-50 px-3 py-3 text-center">
            <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
            <p className="mt-1 text-xs text-slate-500">Best</p>
            <p className="text-sm font-bold text-slate-900">
              {challenge.longestStreak}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}