import type { IUserActivityTracking } from "../../../models/userActivityTracking.model";
import type { UserActivityTrackingResponseDTO } from "../../../dtos/user/tracking/user-activity-tracking-response.dto";

export class UserActivityTrackingMapper {
  static toDTO(
    tracking: IUserActivityTracking,
  ): UserActivityTrackingResponseDTO {
    return {
      _id: tracking._id.toString(),
      userDayTrackingId: tracking.userDayTrackingId.toString(),
      activityId: tracking.activityId.toString(),

      title: tracking.title,
      category: tracking.category,
      status: tracking.status,
      valueType: tracking.valueType,

      ...(tracking.recordedValue !== undefined && {
        recordedValue: tracking.recordedValue,
      }),

      ...(tracking.recordedText !== undefined && {
        recordedText: tracking.recordedText,
      }),

      ...(tracking.unit !== undefined && {
        unit: tracking.unit,
      }),

      evidence: tracking.evidence,

      ...(tracking.skippedReason !== undefined && {
        skippedReason: tracking.skippedReason,
      }),

      ...(tracking.notes !== undefined && {
        notes: tracking.notes,
      }),

      lastUpdatedBy: tracking.lastUpdatedBy,
      startedAt: tracking.startedAt ?? null,
      completedAt: tracking.completedAt ?? null,
    };
  }

  static toDTOList(
    tracking: IUserActivityTracking[],
  ): UserActivityTrackingResponseDTO[] {
    return tracking.map((item) => UserActivityTrackingMapper.toDTO(item));
  }
}
