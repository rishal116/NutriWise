"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { userProgramDayService } from "@/services/user/userProgramDay.service";

import { UserProgramDayDetailsDTO } from "@/dtos/user/program/user-program-day-details.dto";

interface ProgramDayDetailsPageProps {
  params: Promise<{
    programId: string;
    dayNumber: string;
  }>;
}

export default function ProgramDayDetailsPage({
  params,
}: ProgramDayDetailsPageProps) {
  const [day, setDay] = useState<UserProgramDayDetailsDTO | null>(null);
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDay = async () => {
      try {
        const { programId, dayNumber } = await params;

        setProgramId(programId);

        const response = await userProgramDayService.getDayDetails(
          programId,
          Number(dayNumber),
        );

        setDay(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDay();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading day details...
      </div>
    );
  }

  if (!day) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">
          Program day not found
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <Link
        href={`/dashboard/programs/${programId}/days`}
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Days
      </Link>

      <h1 className="mb-8 text-3xl font-bold">
        Day {day.dayNumber}
      </h1>

      {/* Meals */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          🍽 Meals
        </h2>

        {day.meals.length === 0 ? (
          <p className="text-gray-500">No meals available.</p>
        ) : (
          <div className="space-y-4">
            {[...day.meals]
              .sort((a, b) => a.order - b.order)
              .map((meal) => (
                <div
                  key={meal._id}
                  className="rounded-xl border p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {meal.title}
                    </h3>

                    <span className="rounded bg-green-100 px-3 py-1 text-sm capitalize text-green-700">
                      {meal.mealType}
                    </span>
                  </div>

                  {meal.description && (
                    <p className="mt-2 text-gray-600">
                      {meal.description}
                    </p>
                  )}

                  {meal.calories !== undefined && (
                    <p className="mt-3 text-sm text-gray-500">
                      Calories: {meal.calories} kcal
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Workouts */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">
          💪 Workouts
        </h2>

        {day.workouts.length === 0 ? (
          <p className="text-gray-500">No workouts available.</p>
        ) : (
          <div className="space-y-4">
            {[...day.workouts]
              .sort((a, b) => a.order - b.order)
              .map((workout) => (
                <div
                  key={workout._id}
                  className="rounded-xl border p-5"
                >
                  <h3 className="text-lg font-semibold">
                    {workout.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Duration: {workout.duration} min
                  </p>

                  {workout.instructions && (
                    <p className="mt-3 text-gray-600">
                      {workout.instructions}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Habits */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          ✅ Habits
        </h2>

        {day.habits.length === 0 ? (
          <p className="text-gray-500">No habits available.</p>
        ) : (
          <div className="space-y-4">
            {[...day.habits]
              .sort((a, b) => a.order - b.order)
              .map((habit) => (
                <div
                  key={habit._id}
                  className="rounded-xl border p-5"
                >
                  <h3 className="text-lg font-semibold">
                    {habit.title}
                  </h3>

                  {habit.targetValue !== undefined && (
                    <p className="mt-2 text-sm text-gray-500">
                      Target: {habit.targetValue}{" "}
                      {habit.unit ?? ""}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}