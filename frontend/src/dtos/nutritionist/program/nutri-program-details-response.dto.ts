import type { ProgramStatus } from "@/constants/user/program/program-status.constants";
import type { Currency } from "@/constants/common/currency.constants";
import type { Specialization } from "@/constants/nutritionist/profile/specialization.constants";

export interface NutriProgramDetailsResponseDTO {
  userProgramId: string;

  client: {
    userId: string;
    fullName: string;
    profileImage?: string;
  };

  purchase: {
    amount: number;
    currency: Currency;
    purchasedAt: string;
    planTitle: string;
    planDescription?: string;
    specialization: Specialization;
    features: string[];
  };

  program: {
    status: ProgramStatus;
    startDate: string | null;
    endDate: string | null;
    durationDays: number;
    createdAt: string;

    lifecycle: {
      pausedAt: string | null;
      resumedAt: string | null;
      completedAt: string | null;
      cancelledAt: string | null;
    };

    cancellationReason: string | null;
    cancelledBy: string | null;
  };

  progress: {
    totalDays: number;
    completedDays: number;
    currentDay: number;

    totalActivities: number;
    completedActivities: number;
    skippedActivities: number;

    completionPercentage: number;

    currentStreak: number;
    longestStreak: number;
    lastCompletedDay: number;
    lastActivityAt: string | null;
  };
}
