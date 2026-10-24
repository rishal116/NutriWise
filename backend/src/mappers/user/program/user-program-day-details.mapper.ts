import type { IUserProgramDayDetailsProjection } from "../../../types/user/program/user-program-day.projection";
import type {
  UserProgramDayActivityResponseDTO,
  UserProgramDayDetailsResponseDTO,
} from "../../../dtos/user/program/user-program-day-details-response.dto";

export class UserProgramDayDetailsMapper {
  static toResponseDTO(
    projection: IUserProgramDayDetailsProjection,
  ): UserProgramDayDetailsResponseDTO {
    return {
      _id: projection._id.toString(),
      dayNumber: projection.dayNumber,

      tracking: projection.tracking
        ? {
            _id: projection.tracking._id.toString(),
            date: projection.tracking.date,
            status: projection.tracking.status,
            isLocked: projection.tracking.isLocked,
            totalActivities: projection.tracking.totalActivities,
            completedActivities:
              projection.tracking.completedActivities,
            skippedActivities: projection.tracking.skippedActivities,
            overallCompletionPercentage:
              projection.tracking.overallCompletionPercentage,
            startedAt: projection.tracking.startedAt,
            completedAt: projection.tracking.completedAt,
            lastActivityAt: projection.tracking.lastActivityAt,
            userNotes: projection.tracking.userNotes,
            nutritionistNotes: projection.tracking.nutritionistNotes,
          }
        : null,

      activities: projection.activities.map(
        (activity): UserProgramDayActivityResponseDTO => ({
          _id: activity._id.toString(),
          category: activity.category,
          title: activity.title,
          description: activity.description,
          instructions: activity.instructions,
          valueType: activity.valueType,
          targetValue: activity.targetValue,
          unit: activity.unit,
          estimatedDurationMinutes: activity.estimatedDurationMinutes,
          scheduledTime: activity.scheduledTime,
          isRequired: activity.isRequired,
          order: activity.order,

          tracking: {
            status: activity.tracking.status,
            recordedValue: activity.tracking.recordedValue,
            evidence: activity.tracking.evidence,
            skippedReason: activity.tracking.skippedReason,
            notes: activity.tracking.notes,
            nutritionistFeedback:
              activity.tracking.nutritionistFeedback,
            startedAt: activity.tracking.startedAt,
            completedAt: activity.tracking.completedAt,
          },
        }),
      ),
    };
  }
}