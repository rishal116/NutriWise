import { IUserActivityTracking } from "../../../models/userActivityTracking.model";
import { UserActivityTrackingResponseDTO } from "../../../dtos/user/tracking/user-activity-tracking-response.dto";

export class UserActivityTrackingMapper {
  static toDTO(
    tracking: IUserActivityTracking,
  ): UserActivityTrackingResponseDTO {
    return {
      _id: tracking._id.toString(),

      userProgramDayId: tracking.userProgramDayId.toString(),
      userDayTrackingId: tracking.userDayTrackingId.toString(),
      activityId: tracking.activityId.toString(),

      title: tracking.title,
      category: tracking.category,

      status: tracking.status,
      valueType: tracking.valueType,

      ...(tracking.targetValue !== undefined && {
        targetValue: tracking.targetValue,
      }),

      ...(tracking.recordedValue !== undefined && {
        recordedValue: tracking.recordedValue,
      }),

      ...(tracking.unit !== undefined && {
        unit: tracking.unit,
      }),

      ...(tracking.actualDurationMinutes !== undefined && {
        actualDurationMinutes: tracking.actualDurationMinutes,
      }),

      ...(tracking.score !== undefined && {
        score: tracking.score,
      }),

      evidence: tracking.evidence,

      ...(tracking.skippedReason !== undefined && {
        skippedReason: tracking.skippedReason,
      }),

      ...(tracking.notes !== undefined && {
        notes: tracking.notes,
      }),

      ...(tracking.nutritionistFeedback !== undefined && {
        nutritionistFeedback: tracking.nutritionistFeedback,
      }),

      completedBy: tracking.completedBy,
      lastUpdatedBy: tracking.lastUpdatedBy,

      startedAt: tracking.startedAt ?? null,
      completedAt: tracking.completedAt ?? null,

      createdAt: tracking.createdAt,
      updatedAt: tracking.updatedAt,
    };
  }

  static toDTOList(
    tracking: IUserActivityTracking[],
  ): UserActivityTrackingResponseDTO[] {
    return tracking.map((item) => UserActivityTrackingMapper.toDTO(item));
  }
}
