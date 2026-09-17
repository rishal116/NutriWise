import {
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

interface UserChallengeDaysProps {
  challenge: UserChallengeDetailsDTO;
  selectedDayNumber: number | null;
  onSelectDay: (dayNumber: number) => void;
}

export default function UserChallengeDays({
  challenge,
  selectedDayNumber,
  onSelectDay,
}: UserChallengeDaysProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Challenge days
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select a day to view its activities.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {challenge.days
          .slice()
          .sort((a, b) => a.dayNumber - b.dayNumber)
          .map((day) => {
            const isCompleted = day.dayNumber < challenge.currentDay;
            const isCurrent = day.dayNumber === challenge.currentDay;
            const isUpcoming = day.dayNumber > challenge.currentDay;
            const isSelected = day.dayNumber === selectedDayNumber;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => onSelectDay(day.dayNumber)}
                className={`rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                    : "border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      isCurrent
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  >
                    Day
                  </span>

                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : isUpcoming ? (
                    <Lock className="h-4 w-4 text-slate-300" />
                  ) : (
                    <Circle className="h-4 w-4 text-emerald-500" />
                  )}
                </div>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {day.dayNumber}
                </p>

                <p
                  className={`mt-2 text-xs font-medium ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                        ? "text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "Current"
                      : "Upcoming"}
                </p>
              </button>
            );
          })}
      </div>
    </section>
  );
}