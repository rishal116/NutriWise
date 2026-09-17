import {
  UserChallengeActivityDTO,
  UserChallengeDayDTO,
  UserChallengeDetailsDTO,
  UserChallengeProgressDTO,
} from "../../../dtos/user/challenge/user-challenge-details.dto";

import { UserChallengeDetailsResult } from "../../../types/user/challenge/user-challenge-details-result.type";

export const toUserChallengeDetailsDTO = (
  result: UserChallengeDetailsResult,
): UserChallengeDetailsDTO => {
  const completedActivities = new Set(
    result.progress.map((item) => `${item.challengeDayId}:${item.activityId}`),
  );

  const days = result.days.map(
    (day): UserChallengeDayDTO =>
      new UserChallengeDayDTO({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.description,

        activities: day.activities.map(
          (activity): UserChallengeActivityDTO =>
            new UserChallengeActivityDTO({
              id: activity.id,
              type: activity.type,
              title: activity.title,
              description: activity.description,
              instructions: activity.instructions,
              valueType: activity.valueType,
              targetValue: activity.targetValue,
              unit: activity.unit,
              estimatedDurationMinutes: activity.estimatedDurationMinutes,
              imageUrl: activity.imageUrl,
              videoUrl: activity.videoUrl,
              isRequired: activity.isRequired,
              order: activity.order,
              completed: completedActivities.has(`${day.id}:${activity.id}`),
            }),
        ),
      }),
  );

  const progress = result.progress.map(
    (item): UserChallengeProgressDTO =>
      new UserChallengeProgressDTO({
        id: item.id,
        challengeDayId: item.challengeDayId,
        activityId: item.activityId,
        completedAt: item.completedAt,
      }),
  );

  return new UserChallengeDetailsDTO({
    id: result.id,
    status: result.status,
    joinedAt: result.joinedAt,
    startedAt: result.startedAt,
    currentDay: result.currentDay,
    progressPercentage: result.progressPercentage,
    currentStreak: result.currentStreak,
    longestStreak: result.longestStreak,
    completedAt: result.completedAt,

    challenge: {
      id: result.challenge.id,
      title: result.challenge.title,
      description: result.challenge.description,
      instructions: result.challenge.instructions,
      coverImageUrl: result.challenge.coverImageUrl,
      category: result.challenge.category,
      difficulty: result.challenge.difficulty,
      accessType: result.challenge.accessType,
      durationDays: result.challenge.durationDays,
    },

    days,
    progress,
  });
};
