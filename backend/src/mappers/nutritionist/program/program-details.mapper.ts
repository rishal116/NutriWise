import { NutriProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-details-response.dto";
import { INutriProgramDetailsProjection } from "../../../types/nutritionist/program/nutri-program-details.projection";

export class NutriProgramDetailsMapper {
  static toDTO(
    program: INutriProgramDetailsProjection,
  ): NutriProgramDetailsResponseDTO {
    return {
      userProgramId: program.userProgramId.toString(),

      userId: program.userId.toString(),
      userFullName: program.userFullName,
      userProfileImage: program.userProfileImage,

      planTitle: program.planTitle,
      planDescription: program.planDescription,
      specialization: program.specialization,

      programStatus: program.programStatus,

      startDate: program.startDate,
      endDate: program.endDate,
      durationDays: program.durationDays,

      completionPercentage: program.completionPercentage,

      completedDays: program.completedDays,
      totalDays: program.totalDays,

      completedActivities: program.completedActivities,
      totalActivities: program.totalActivities,
      skippedActivities: program.skippedActivities,

      currentStreak: program.currentStreak,
      longestStreak: program.longestStreak,

      lastActivityAt: program.lastActivityAt,
    };
  }
}
