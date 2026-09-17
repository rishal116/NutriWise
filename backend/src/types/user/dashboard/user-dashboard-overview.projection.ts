import type { Types } from "mongoose";

export interface IUserDashboardOverviewProjection {
  user: {
    fullName: string;
    profileImage?: string;
  };

  coaching: {
    activeProgram: {
      id: Types.ObjectId;
      title: string;
      nutritionist: {
        id: Types.ObjectId;
        fullName: string;
        profileImage?: string;
      };
      status: string;
      currentDay: number;
      durationDays: number;
      completionPercentage: number;
      startDate: Date;
      endDate: Date;
    } | null;
  };

  summary: {
    activePrograms: number;
    joinedChallenges: number;
  };
}
