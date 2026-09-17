"use client";

import { useEffect, useState } from "react";

import { userChallengeService } from "@/services/user/userChallenge.service";

import { UserChallengeListQuery } from "@/dtos/user/challenge/user-challenge-request.dto";

import { UserChallengeCardDTO } from "@/dtos/user/challenge/user-challenge-card.dto";

import UserChallengeCard from "@/components/user/challenge/UserChallengeCard";

import UserChallengeSkeleton from "@/components/user/challenge/UserChallengeSkeleton";

import UserChallengeEmpty from "@/components/user/challenge/UserChallengeEmpty";

const LIMIT = 12;

export default function UserChallengesPage() {
  const [challenges, setChallenges] = useState<UserChallengeCardDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const query: UserChallengeListQuery = {
          limit: LIMIT,
          sortBy: "newest",
        };

        const response = await userChallengeService.browseChallenges(query);

        setChallenges(response.data.items);
      } catch (error) {
        console.error("Failed to fetch user challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-emerald-600">
            Your wellness journey
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Challenges
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Keep building healthy habits, one day at a time.
          </p>
        </div>

        {loading ? (
          <UserChallengeSkeleton />
        ) : challenges.length === 0 ? (
          <UserChallengeEmpty />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {challenges.map((challenge) => (
              <UserChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
