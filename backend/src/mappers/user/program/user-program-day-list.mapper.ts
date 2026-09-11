import { UserDayTrackingStatus } from "../../../models/userDayTracking.model";
import { IUserProgramDayListProjection } from "../../../types/user/program/user-program-day.projection";
import { UserProgramDayListResponseDTO } from "../../../dtos/user/program/user-program-day-list-response.dto";

export class UserProgramDayListMapper {
  static toResponseDTO(
    projection: IUserProgramDayListProjection,
  ): UserProgramDayListResponseDTO {
    return {
      _id: projection._id.toString(),
      userProgramId: projection.userProgramId.toString(),
      dayNumber: projection.dayNumber,
      totalActivities: projection.totalActivities,
      requiredActivities: projection.requiredActivities,
      status: projection.tracking?.status ?? UserDayTrackingStatus.NOT_STARTED,
      completedActivities: projection.tracking?.completedActivities ?? 0,
      skippedActivities: projection.tracking?.skippedActivities ?? 0,
      completionPercentage:
        projection.tracking?.overallCompletionPercentage ?? 0,
      adherenceScore: projection.tracking?.adherenceScore ?? 0,
      isLocked: projection.tracking?.isLocked ?? true,
    };
  }

  static toResponseDTOList(
    projections: IUserProgramDayListProjection[],
  ): UserProgramDayListResponseDTO[] {
    return projections.map((projection) => this.toResponseDTO(projection));
  }
}
