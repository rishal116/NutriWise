import type { NutriProgramDetailsResponseDTO } from "../../../dtos/nutritionist/program/nutri-program-details-response.dto";
import type { INutriProgramDetailsProjection } from "../../../types/nutritionist/program/nutri-program-details.projection";

export class NutriProgramDetailsMapper {
  static toDTO(
    program: INutriProgramDetailsProjection,
  ): NutriProgramDetailsResponseDTO {
    return {
      userProgramId: program.userProgramId.toString(),

      client: {
        userId: program.client.userId.toString(),
        fullName: program.client.fullName,
        profileImage: program.client.profileImage,
      },

      purchase: {
        amount: program.purchase.amount,
        currency: program.purchase.currency,
        purchasedAt: program.purchase.purchasedAt,
        planTitle: program.purchase.planTitle,
        planDescription: program.purchase.planDescription,
        specialization: program.purchase.specialization,
        features: program.purchase.features,
      },

      program: {
        status: program.program.status,
        startDate: program.program.startDate,
        endDate: program.program.endDate,
        durationDays: program.program.durationDays,
        createdAt: program.program.createdAt,

        lifecycle: {
          pausedAt: program.program.lifecycle.pausedAt,
          resumedAt: program.program.lifecycle.resumedAt,
          completedAt: program.program.lifecycle.completedAt,
          cancelledAt: program.program.lifecycle.cancelledAt,
        },

        cancellationReason: program.program.cancellationReason,
        cancelledBy: program.program.cancelledBy?.toString() ?? null,
      },

      progress: {
        totalDays: program.progress.totalDays,
        completedDays: program.progress.completedDays,
        currentDay: program.progress.currentDay,

        totalActivities: program.progress.totalActivities,
        completedActivities: program.progress.completedActivities,
        skippedActivities: program.progress.skippedActivities,

        completionPercentage: program.progress.completionPercentage,

        currentStreak: program.progress.currentStreak,
        longestStreak: program.progress.longestStreak,
        lastCompletedDay: program.progress.lastCompletedDay,
        lastActivityAt: program.progress.lastActivityAt,
      },
    };
  }
}
