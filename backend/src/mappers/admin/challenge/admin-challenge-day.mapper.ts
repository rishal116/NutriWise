import type { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import type { AdminChallengeDayListProjection } from "../../../types/admin/challenge-day/admin-challenge-day.projection";
import type { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";
import type { AdminChallengeDayDetailsProjection } from "../../../types/admin/challenge-day/admin-challenge-day-details.projection";

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
  day: AdminChallengeDayDetailsProjection,
): AdminChallengeDayDetailsDTO {
  return {
    id: day.id,
    challengeId: day.challengeId,
    dayNumber: day.dayNumber,
    ...(day.title !== undefined && { title: day.title }),
    ...(day.description !== undefined && {
      description: day.description,
    }),
    activities: day.activities.map((activity) => ({
      id: activity.id,
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
