
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { nutritionistPlanDayService } from "@/services/nutritionist/nutri-plan-day.service";
import type { NutritionistPlanDayListItemDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-item.dto";
import { NutritionistPlanDaySort } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

interface PlanDaysPreviewProps {
  planId: string;
}

export default function PlanDaysPreview({ planId }: PlanDaysPreviewProps) {
  const [days, setDays] = useState<NutritionistPlanDayListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const daysUrl = `/nutritionist/plans/${planId}/days`;
  const createDayUrl = `${daysUrl}/create`;

  const fetchDays = useCallback(async () => {
    try {
      setLoading(true);

      const response = await nutritionistPlanDayService.getPlanDays(
        planId,
        {
          limit: 3,
          sort: NutritionistPlanDaySort.DAY_ASC,
        },
      );

      setDays(response.items);
    } catch {
      toast.error("Failed to load plan days.");
    } finally {
      setLoading(false);
    }
  }, [planId]);

  useEffect(() => {
    void fetchDays();
  }, [fetchDays]);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Plan Days
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Preview and manage your plan schedule.
          </p>
        </div>

        <Link
          href={daysUrl}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
        >
          Manage Days
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : days.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center">
            <div className="mb-3 rounded-full bg-emerald-50 p-3">
              <CalendarDays className="h-6 w-6 text-emerald-600" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No plan days yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Start building your schedule by adding the first day to this
              nutrition plan.
            </p>

            <Link
              href={createDayUrl}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add First Day
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {days.map((day) => (
              <Link
                key={day.id}
                href={`${daysUrl}/${day.dayNumber}`}
                className="group flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-emerald-200 hover:bg-emerald-50/40 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                    {String(day.dayNumber).padStart(2, "0")}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-emerald-700">
                      {day.title?.trim() || `Day ${day.dayNumber}`}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {day.description?.trim() || "No description added"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-sm sm:text-right">
                    <p className="font-semibold text-slate-700">
                      {day.totalActivities} activities
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {day.requiredActivities} required
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-emerald-600" />
                </div>
              </Link>
            ))}

            <div className="flex flex-col justify-between gap-3 pt-2 sm:flex-row sm:items-center">
              <p className="text-xs text-slate-500">
                Showing the first {days.length}{" "}
                {days.length === 1 ? "day" : "days"}.
              </p>

              <Link
                href={daysUrl}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
              >
                View all plan days
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
