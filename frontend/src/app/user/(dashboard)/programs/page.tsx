"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { userProgramService } from "@/services/user/userProgram.service";

import { UserProgramCardDTO } from "@/dtos/user/program/user-program-card.dto";
import {
  ProgramStatus,
  UserProgramSort,
} from "@/dtos/user/program/user-program-request.dto";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<UserProgramCardDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      setLoading(true);

      const response = await userProgramService.browsePrograms({
        limit: 10,
        sort: UserProgramSort.NEWEST,
      });

      setPrograms(response.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20">Loading programs...</div>;
  }

  if (programs.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">No purchased programs</h2>

        <p className="mt-2 text-gray-500">
          Purchase a nutrition program to begin your journey.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">My Programs</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {programs.map((program) => (
          <Link key={program._id} href={`/user/programs/${program._id}`}>
            <div className="cursor-pointer rounded-xl border bg-white p-5 transition hover:shadow-lg">
              <h2 className="text-lg font-semibold">{program.title}</h2>

              <p className="mt-1 text-sm text-gray-500">Nutritionist</p>

              <p className="font-medium">{program.nutritionist.fullName}</p>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="capitalize">{program.status}</span>
                </div>

                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{program.completionPercentage}%</span>
                </div>

                <div className="flex justify-between">
                  <span>Current Day</span>
                  <span>
                    {program.currentDay} / {program.durationDays}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Start</span>
                  <span>
                    {new Date(program.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>End</span>
                  <span>{new Date(program.endDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{
                    width: `${program.completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
