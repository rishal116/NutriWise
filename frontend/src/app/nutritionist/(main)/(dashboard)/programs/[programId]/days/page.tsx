"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Utensils, Dumbbell, Target } from "lucide-react";
import { toast } from "sonner";

import { nutriProgramDayService } from "@/services/nutritionist/nutriProgramDay.service";
import type { ProgramDaySummaryDTO } from "@/dtos/nutritionist/program/program-day-response.dto";

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

function ListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
      <p className="text-sm font-bold text-slate-700">No days added yet</p>
      <p className="text-xs text-slate-400">
        Start building this program by adding its first day.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
      >
        <Plus size={14} />
        Add day
      </button>
    </div>
  );
}

function CountPill({
  icon: Icon,
  count,
  label,
}: {
  icon: typeof Utensils;
  count: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      <Icon size={14} className="text-slate-400" />
      <span>
        {count} {label}
      </span>
    </div>
  );
}

export default function ProgramDaysPage() {
  const { programId } = useParams<{ programId: string }>();
  const router = useRouter();

  const [days, setDays] = useState<ProgramDaySummaryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;

    let cancelled = false;

    (async () => {
      setLoading(true);

      try {
        const res = await nutriProgramDayService.getProgramDays(programId);
        if (cancelled) return;

        const sorted = [...res.items].sort(
          (a, b) => a.dayNumber - b.dayNumber,
        );
        setDays(sorted);
      } catch {
        if (!cancelled) {
          toast.error("Couldn't load this program's days.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [programId]);

  const goToCreate = () =>
    router.push(`/nutritionist/programs/${programId}/days/create`);

  const goToDay = (dayId: string) =>
    router.push(`/nutritionist/programs/${programId}/days/${dayId}`);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => router.push(`/nutritionist/programs/${programId}`)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to program
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Program days
            </h1>
            <p className="text-sm text-slate-500">
              Meals, workouts, and habits for each day of this program.
            </p>
          </div>
          {!loading && days.length > 0 && (
            <button
              type="button"
              onClick={goToCreate}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700"
            >
              <Plus size={14} />
              Add day
            </button>
          )}
        </div>

        {loading ? (
          <ListSkeleton />
        ) : days.length === 0 ? (
          <EmptyState onCreate={goToCreate} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => goToDay(day.id)}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-colors hover:border-emerald-200 hover:bg-emerald-50/30"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    Day {day.dayNumber}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Updated {formatDate(day.updatedAt)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <CountPill
                    icon={Utensils}
                    count={day.mealCount}
                    label="meals"
                  />
                  <CountPill
                    icon={Dumbbell}
                    count={day.workoutCount}
                    label="workouts"
                  />
                  <CountPill
                    icon={Target}
                    count={day.habitCount}
                    label="habits"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}