import { PublicChallengeDetailsDTO } from "../../../dtos/public/challenge/public-challenge-details.dto";

import { PublicChallengeDetailsResult } from "../../../types/public/challenge/public-challenge-details-result.type";

import { PublicChallengeDayListItem } from "../../../types/public/challenge-day/public-challenge-day-result.type";

import { PublicChallengeParticipationResult } from "../../../types/public/challenge/public-challenge-participation-result.type";

export const toPublicChallengeDetailsDTO = (
  challenge: PublicChallengeDetailsResult,
  days: PublicChallengeDayListItem[],
  participation: PublicChallengeParticipationResult | null,
): PublicChallengeDetailsDTO => {
  return new PublicChallengeDetailsDTO({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    instructions: challenge.instructions,
    coverImageUrl: challenge.coverImageUrl,
    category: challenge.category,
    difficulty: challenge.difficulty,
    accessType: challenge.accessType,
    durationDays: challenge.durationDays,
    days,
    participation: participation
      ? {
          userChallengeId: participation.userChallengeId,
          status: participation.status,
          currentDay: participation.currentDay,
          progressPercentage: participation.progressPercentage,
          currentStreak: participation.currentStreak,
          longestStreak: participation.longestStreak,
        }
      : {
          status: "not_joined",
        },
  });
};