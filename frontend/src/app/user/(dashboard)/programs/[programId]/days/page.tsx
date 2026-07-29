"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { userProgramDayService } from "@/services/user/userProgramDay.service";
import { UserProgramDayDTO } from "@/dtos/user/program/user-program-day.dto";

interface ProgramDaysPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export default function ProgramDaysPage({
  params,
}: ProgramDaysPageProps) {
  const [days, setDays] = useState<UserProgramDayDTO[]>([]);
  const [programId, setProgramId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDays = async () => {
      try {
        const { programId } = await params;

        setProgramId(programId);

        const response =
          await userProgramDayService.browseProgramDays(programId);

        setDays(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDays();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading program days...
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">
          No program days found
        </h2>

        <p className="mt-2 text-gray-500">
          This program doesn't contain any days yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Link
        href={`/user/programs/${programId}`}
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Program
      </Link>

      <h1 className="mb-6 text-3xl font-bold">
        Program Days
      </h1>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => (
          <Link
            key={day._id}
            href={`/user/programs/${programId}/days/${day.dayNumber}`}
          >
            <div className="cursor-pointer rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
              <h2 className="text-xl font-semibold">
                Day {day.dayNumber}
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Meals</span>
                  <span>{day.mealCount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Workouts</span>
                  <span>{day.workoutCount}</span>
                </div>

                <div className="flex justify-between">
                  <span>Habits</span>
                  <span>{day.habitCount}</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-green-600 px-4 py-2 text-center text-sm font-medium text-white">
                View Day
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}