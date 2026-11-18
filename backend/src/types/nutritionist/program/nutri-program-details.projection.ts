import { Types } from "mongoose";

import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";
import type { Currency } from "../../../constants/common/currency.constants";
import type { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";

export interface INutriProgramDetailsProjection {
  userProgramId: Types.ObjectId;

  client: {
    userId: Types.ObjectId;
    fullName: string;
    profileImage?: string;
  };

  purchase: {
    amount: number;
    currency: Currency;
    purchasedAt: Date;

    planTitle: string;
    planDescription?: string;
    specialization: Specialization;
    features: string[];
  };

  program: {
    status: ProgramStatus;
    startDate: Date | null;
    endDate: Date | null;
    durationDays: number;
    createdAt: Date;

    lifecycle: {
      pausedAt: Date | null;
      resumedAt: Date | null;
      completedAt: Date | null;
      cancelledAt: Date | null;
    };

    cancellationReason: string | null;
    cancelledBy: Types.ObjectId | null;
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
    lastActivityAt: Date | null;
  };
}
