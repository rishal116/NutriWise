"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";

import { userChallengeService } from "@/services/user/userChallenge.service";

import { UserChallengeDetailsDTO } from "@/dtos/user/challenge/user-challenge-details.dto";

import UserChallengeHeader from "@/components/user/challenge/UserChallengeHeader";

import UserChallengeProgress from "@/components/user/challenge/UserChallengeProgress";

import UserChallengeDays from "@/components/user/challenge/UserChallengeDays";

import UserChallengeDayDetails from "@/components/user/challenge/UserChallengeDayDetails";

interface UserChallengePageProps {
  params: Promise<{
    userChallengeId: string;
  }>;
}

export default function UserChallengeDetailsPage({
  params,
}: UserChallengePageProps) {
  const { userChallengeId } = use(params);

  const [challenge, setChallenge] = useState<UserChallengeDetailsDTO | null>(
    null,
  );

  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response =
          await userChallengeService.getChallengeDetails(userChallengeId);

        setChallenge(response.data);
      } catch (error) {
        console.error("Failed to fetch challenge:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [userChallengeId]);

  const selectedDay = useMemo(() => {
    if (!challenge || selectedDayNumber === null) {
      return null;
    }

    return (
      challenge.days.find((day) => day.dayNumber === selectedDayNumber) ?? null
    );
  }, [challenge, selectedDayNumber]);

  useEffect(() => {
    if (!challenge || challenge.days.length === 0) {
      return;
    }

    const currentDayExists = challenge.days.some(
      (day) => day.dayNumber === challenge.currentDay,
    );

    setSelectedDayNumber(
      currentDayExists ? challenge.currentDay : challenge.days[0].dayNumber,
    );
  }, [challenge]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-5">
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-56 rounded-2xl bg-slate-200" />
          <div className="h-36 rounded-2xl bg-slate-200" />
          <div className="h-72 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-slate-900">
          Challenge not found
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          {"We couldn't load this challenge."}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/user/challenges"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          My challenges
        </Link>

        <div className="mt-6 space-y-5">
          <UserChallengeHeader challenge={challenge} />

          <UserChallengeProgress challenge={challenge} />

          <UserChallengeDays
            challenge={challenge}
            selectedDayNumber={selectedDayNumber}
            onSelectDay={setSelectedDayNumber}
          />

          {selectedDay && (
            <UserChallengeDayDetails
              userChallengeId={userChallengeId}
              challenge={challenge}
              day={selectedDay}
              onChallengeUpdate={setChallenge}
            />
          )}
        </div>
      </div>
    </main>
  );
}
