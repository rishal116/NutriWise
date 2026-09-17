import { UserChallengeCardDTO } from "../../../dtos/user/challenge/user-challenge-card.dto";

import { UserChallengeListItem } from "../../../types/user/challenge/user-challenge-list-item.type";

export const toUserChallengeCardDTO = (
  challenge: UserChallengeListItem,
): UserChallengeCardDTO => {
  return new UserChallengeCardDTO({
    id: challenge.id,
    challengeId: challenge.challengeId,
    title: challenge.title,
    thumbnailUrl: challenge.thumbnailUrl,
    category: challenge.category,
    difficulty: challenge.difficulty,
    accessType: challenge.accessType,
    durationDays: challenge.durationDays,
    status: challenge.status,
    currentDay: challenge.currentDay,
    progressPercentage: challenge.progressPercentage,
    currentStreak: challenge.currentStreak,
    longestStreak: challenge.longestStreak,
    joinedAt: challenge.joinedAt,
    completedAt: challenge.completedAt,
  });
};
