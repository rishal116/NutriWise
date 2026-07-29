"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { userProgramService } from "@/services/user/userProgram.service";
import { UserProgramDetailsDTO } from "@/dtos/user/program/user-program-details.dto";

interface ProgramDetailsPageProps {
  params: Promise<{
    programId: string;
  }>;
}

export default function ProgramDetailsPage({
  params,
}: ProgramDetailsPageProps) {
  const [program, setProgram] = useState<UserProgramDetailsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        const { programId } = await params;

        const response =
          await userProgramService.getProgramDetails(programId);

        setProgram(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [params]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        Loading program...
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-semibold">Program not found</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Link
        href="/dashboard/programs"
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Programs
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{program.title}</h1>

        <div className="mt-2">
          <p className="text-gray-500">Nutritionist</p>
          <p className="font-medium">{program.nutritionist.fullName}</p>
          <p className="text-sm text-gray-500">
            @{program.nutritionist.username}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Program Status"
            value={program.status}
          />

          <InfoCard
            title="Subscription"
            value={program.subscriptionStatus}
          />

          <InfoCard
            title="Payment"
            value={program.paymentStatus}
          />

          <InfoCard
            title="Progress"
            value={`${program.completionPercentage}%`}
          />

          <InfoCard
            title="Current Day"
            value={`${program.currentDay} / ${program.durationDays}`}
          />

          <InfoCard
            title="Duration"
            value={`${program.durationDays} Days`}
          />

          <InfoCard
            title="Start Date"
            value={new Date(program.startDate).toLocaleDateString()}
          />

          <InfoCard
            title="End Date"
            value={new Date(program.endDate).toLocaleDateString()}
          />
        </div>

        <div className="mt-8">
          <div className="mb-2 flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{program.completionPercentage}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-600 transition-all"
              style={{
                width: `${program.completionPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <Link
            href={`/user/programs/${program._id}/days`}
            className="inline-flex rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
          >
            View Program Days
          </Link>
        </div>
      </div>
    </div>
  );
}

interface InfoCardProps {
  title: string;
  value: string | number;
}

function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-lg font-semibold capitalize">
        {value}
      </p>
    </div>
  );
}