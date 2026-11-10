"use client";

import { useEffect, useState } from "react";

import { publicChallengeService } from "@/services/public/publicChallenge.service";

import type { PublicChallengeSectionDTO } from "@/dtos/public/challenge/public-challenge-section.dto";

import { ChallengeSection } from "./ChallengeSection";

import { ChallengeSectionSkeleton } from "./ChallengeSectionSkeleton";

export function ChallengeListing() {
  const [sections, setSections] = useState<PublicChallengeSectionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await publicChallengeService.getChallengeSections();

        setSections(response.data ?? []);
      } catch {
        setError("Unable to load challenges right now.");
      } finally {
        setLoading(false);
      }
    };

    void fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 pb-16 sm:space-y-14">
        {Array.from({ length: 4 }).map((_, index) => (
          <ChallengeSectionSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="mx-4 flex flex-col items-center gap-2 rounded-2xl border border-[#D1FAE5] bg-white px-6 py-14 text-center shadow-sm sm:mx-6 lg:mx-8"
      >
        <p className="text-sm font-medium text-[#065F46]">{error}</p>
        <p className="text-xs text-slate-600">
          Please refresh the page or check back in a moment.
        </p>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="mx-4 rounded-2xl border border-dashed border-[#047857]/30 bg-[#ECFDF5] px-6 py-16 text-center sm:mx-6 lg:mx-8">
        <h2 className="text-lg font-semibold text-[#065F46]">
          No challenges available
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Check back soon for new challenges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16 sm:space-y-14">
      {sections.map((section) => (
        <ChallengeSection key={section.key} section={section} />
      ))}
    </div>
  );
}
