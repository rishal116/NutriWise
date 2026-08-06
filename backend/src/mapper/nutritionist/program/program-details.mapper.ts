import { UserProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/program-details-response.dto";
import { IUserProgramDetailsProjection } from "../../../types/nutritionist/program/program-details.projection";

export class ProgramDetailsMapper {
  static toDTO(
    program: IUserProgramDetailsProjection,
  ): UserProgramDetailsResponseDTO {
    return {
      userProgramId: program.userProgramId.toString(),

      userId: program.userId.toString(),
      userFullName: program.userFullName,
      userProfileImage: program.userProfileImage,

      planId: program.planId.toString(),
      planTitle: program.planTitle,
      planDescription: program.planDescription,
      specialization: program.specialization,

      subscriptionStatus: program.subscriptionStatus,
      paymentStatus: program.paymentStatus,

      programStatus: program.programStatus,

      startDate: program.startDate,
      endDate: program.endDate,
      durationDays: program.durationDays,

      completionPercentage: program.completionPercentage,
      adherenceScore: program.adherenceScore,

      completedDays: program.completedDays,
      totalDays: program.totalDays,

      completedActivities: program.completedActivities,
      totalActivities: program.totalActivities,
      skippedActivities: program.skippedActivities,

      currentStreak: program.currentStreak,
      longestStreak: program.longestStreak,

      lastCompletedDay: program.lastCompletedDay,
      lastActivityAt: program.lastActivityAt,

      programNotes: program.programNotes,
    };
  }
}
