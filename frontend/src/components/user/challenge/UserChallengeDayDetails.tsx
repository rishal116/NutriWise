import { CalendarCheck2, ListChecks } from "lucide-react";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import UserChallengeActivityList from "./UserChallengeActivityList";

import { UserChallengeDayDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

interface UserChallengeDayDetailsProps {
  userChallengeId: string;
  challenge: UserChallengeDetailsDTO;
  day: UserChallengeDayDTO;
  onChallengeUpdate: (challenge: UserChallengeDetailsDTO) => void;
}

export default function UserChallengeDayDetails({
  userChallengeId,
  challenge,
  day,
  onChallengeUpdate,
}: UserChallengeDayDetailsProps) {
  const completedCount = day.activities.filter(
    (activity) => activity.completed,
  ).length;

  const totalCount = day.activities.length;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <CalendarCheck2 className="h-4 w-4" />
              Day {day.dayNumber}
            </div>

            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {day.title || `Day ${day.dayNumber}`}
            </h2>

            {day.description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {day.description}
              </p>
            )}
          </div>

          <div className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
            <ListChecks className="h-4 w-4 text-emerald-600" />
            {completedCount} / {totalCount} completed
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <UserChallengeActivityList
          userChallengeId={userChallengeId}
          challenge={challenge}
          day={day}
          onChallengeUpdate={onChallengeUpdate}
        />
      </div>
    </section>
  );
}
