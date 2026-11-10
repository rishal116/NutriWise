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
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChallenges = async () => {
      try {
        const query: UserChallengeListQuery = {
          limit: LIMIT,
          sortBy: "newest",
        };

        const response = await userChallengeService.browseChallenges(query);

        if (!isMounted) return;

        if (!response.data) {
          setChallenges([]);
          setNextCursor(null);
          setHasMore(false);
          return;
        }

        setChallenges(response.data.items);
        setNextCursor(response.data.nextCursor);
        setHasMore(response.data.hasMore);
      } catch (error) {
        if (!isMounted) return;

        console.error("Failed to fetch user challenges:", error);
        setError("Unable to load your challenges. Please try again.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchChallenges();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (!nextCursor || !hasMore || loadingMore) return;

    try {
      setLoadingMore(true);

      const query: UserChallengeListQuery = {
        limit: LIMIT,
        sortBy: "newest",
        cursor: nextCursor,
      };

      const response = await userChallengeService.browseChallenges(query);

      if (!response.data) return;

      setChallenges((previous) => [
        ...previous,
        ...response.data!.items,
      ]);

      setNextCursor(response.data.nextCursor);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Failed to load more challenges:", error);
    } finally {
      setLoadingMore(false);
    }
  };

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
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : challenges.length === 0 ? (
          <UserChallengeEmpty />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {challenges.map((challenge) => (
                <UserChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                />
              ))}
            </div>

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}