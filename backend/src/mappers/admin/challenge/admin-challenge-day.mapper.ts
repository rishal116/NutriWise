import type { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import type { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";
import type { AdminChallengeDayListProjection } from "../../../types/admin/challenge-day/admin-challenge-day.projection";
import type { IChallengeDay } from "../../../models/challengeDay.model";

export function toAdminChallengeDayListItemDTO(
  day: AdminChallengeDayListProjection,
): AdminChallengeDayListItemDTO {
  return {
    id: day.id,
    challengeId: day.challengeId,
    dayNumber: day.dayNumber,
    ...(day.title !== undefined && { title: day.title }),
    activityCount: day.activityCount,
  };
}

export function toAdminChallengeDayDetailsDTO(
  day: IChallengeDay,
): AdminChallengeDayDetailsDTO {
  return {
    id: day._id.toString(),
    challengeId: day.challengeId.toString(),
    dayNumber: day.dayNumber,
    ...(day.title !== undefined && { title: day.title }),
    ...(day.description !== undefined && {
      description: day.description,
    }),
    activities: day.activities.map((activity) => ({
      id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      ...(activity.description !== undefined && {
        description: activity.description,
      }),
      ...(activity.instructions !== undefined && {
        instructions: activity.instructions,
      }),
      valueType: activity.valueType,
      ...(activity.targetValue !== undefined && {
        targetValue: activity.targetValue,
      }),
      ...(activity.unit !== undefined && { unit: activity.unit }),
      ...(activity.estimatedDurationMinutes !== undefined && {
        estimatedDurationMinutes: activity.estimatedDurationMinutes,
      }),
      ...(activity.imageUrl !== undefined && {
        imageUrl: activity.imageUrl,
      }),
      ...(activity.videoUrl !== undefined && {
        videoUrl: activity.videoUrl,
      }),
      isRequired: activity.isRequired,
      order: activity.order,
    })),
  };
}