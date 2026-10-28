import type { Types } from "mongoose";
import type { ProgramStatus } from "../../../models/userProgram.model";
import type { UserDayTrackingStatus } from "../../../models/userDayTracking.model";
import type { MeetingStatus } from "../../../models/meeting.model";
import type { UserChallengeStatus } from "../../../models/userChallenge.model";
import type { Currency } from "../../../constants/currency.constants";

export interface IUserDashboardStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  upcomingPrograms: number;
  pausedPrograms: number;
  cancelledPrograms: number;
  upcomingConsultations: number;
  unreadNotifications: number;
  activeChallenges: number;
  completedChallenges: number;
}

export interface IUserDashboardProgramProjection {
  id: Types.ObjectId;
  userPlanId: Types.ObjectId;
  planId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  nutritionist: {
    id: Types.ObjectId;
    fullName: string;
    profileImage?: string;
  };
  startDate: Date;
  endDate: Date;
  durationDays: number;
  status: ProgramStatus;
  progress: {
    totalDays: number;
    completedDays: number;
    currentDay: number;
    totalActivities: number;
    completedActivities: number;
    completionPercentage: number;
    currentStreak: number;
  } | null;
}

export interface IUserDashboardTodayTrackingProjection {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userProgramDayId: Types.ObjectId;
  dayNumber: number;
  date: Date;
  status: UserDayTrackingStatus;
  totalActivities: number;
  completedActivities: number;
  skippedActivities: number;
  completionPercentage: number;
}

export interface IUserDashboardWeeklyProgressProjection {
  completedDays: number;
  totalTrackedDays: number;
  completedActivities: number;
  totalActivities: number;
  dailyProgress: {
    date: Date;
    completedActivities: number;
    totalActivities: number;
  }[];
}

export interface IUserDashboardConsultationProjection {
  _id: Types.ObjectId;
  title: string;
  nutritionistId: Types.ObjectId;
  scheduledAt: Date;
  durationInMinutes: number;
  status: MeetingStatus;
}

export interface IUserDashboardPaymentOverviewProjection {
  totalSpent: number;
  monthlySpending: {
    year: number;
    month: number;
    amount: number;
  }[];
  currency: Currency;
}

export interface IUserDashboardProgramStatusCountProjection {
  _id: ProgramStatus;
  count: number;
}

export interface IUserDashboardChallengeStatusCountProjection {
  _id: UserChallengeStatus;
  count: number;
}
