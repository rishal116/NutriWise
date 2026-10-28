import { injectable } from "inversify";
import { Types } from "mongoose";

import { CURRENCY } from "../../../../constants/currency.constants";
import { UserProgramModel } from "../../../../models/userProgram.model";
import { UserProgramProgressModel } from "../../../../models/userProgramProgress.model";
import { UserDayTrackingModel } from "../../../../models/userDayTracking.model";
import { MeetingModel } from "../../../../models/meeting.model";
import { PaymentModel } from "../../../../models/payment.model";
import { NotificationModel } from "../../../../models/notification.model";
import { UserChallengeModel } from "../../../../models/userChallenge.model";

import type { IUserDashboardRepository } from "../../../interfaces/user/account/IUserDashboardRepository";

import type {
  IUserDashboardStats,
  IUserDashboardProgramProjection,
  IUserDashboardTodayTrackingProjection,
  IUserDashboardWeeklyProgressProjection,
  IUserDashboardConsultationProjection,
  IUserDashboardPaymentOverviewProjection,
  IUserDashboardProgramStatusCountProjection,
  IUserDashboardChallengeStatusCountProjection,
} from "../../../../types/user/dashboard/user-dashboard.projection";

interface WeeklyProgressAggregation {
  summary: {
    completedDays: number;
    totalTrackedDays: number;
    completedActivities: number;
    totalActivities: number;
  }[];
  dailyProgress: {
    date: Date;
    completedActivities: number;
    totalActivities: number;
  }[];
}

interface PaymentOverviewAggregation {
  totalSpent: number;
  currency: typeof CURRENCY;
  monthlySpending: {
    year: number;
    month: number;
    amount: number;
  }[];
}

@injectable()
export class UserDashboardRepository implements IUserDashboardRepository {
  async getOverview(userId: string): Promise<IUserDashboardStats | null> {
    const userObjectId = this.toObjectId(userId);

    if (!userObjectId) {
      return null;
    }

    const [
      programCounts,
      challengeCounts,
      upcomingConsultations,
      unreadNotifications,
    ] = await Promise.all([
      UserProgramModel.aggregate<IUserDashboardProgramStatusCountProjection>([
        { $match: { userId: userObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]).exec(),

      UserChallengeModel.aggregate<IUserDashboardChallengeStatusCountProjection>(
        [
          { $match: { userId: userObjectId } },
          { $group: { _id: "$status", count: { $sum: 1 } } },
        ],
      ).exec(),

      MeetingModel.countDocuments({
        userId: userObjectId,
        status: "scheduled",
        scheduledAt: { $gte: new Date() },
        isDeleted: { $ne: true },
      }).exec(),

      NotificationModel.countDocuments({
        recipientId: userObjectId,
        isRead: false,
      }).exec(),
    ]);

    const programCountByStatus = new Map(
      programCounts.map(({ _id, count }) => [_id, count]),
    );

    const challengeCountByStatus = new Map(
      challengeCounts.map(({ _id, count }) => [_id, count]),
    );

    return {
      totalPrograms: programCounts.reduce(
        (total, item) => total + item.count,
        0,
      ),
      activePrograms: programCountByStatus.get("active") ?? 0,
      completedPrograms: programCountByStatus.get("completed") ?? 0,
      upcomingPrograms: programCountByStatus.get("upcoming") ?? 0,
      pausedPrograms: programCountByStatus.get("paused") ?? 0,
      cancelledPrograms: programCountByStatus.get("cancelled") ?? 0,
      upcomingConsultations,
      unreadNotifications,
      activeChallenges: challengeCountByStatus.get("active") ?? 0,
      completedChallenges: challengeCountByStatus.get("completed") ?? 0,
    };
  }

  async getActivePrograms(
    userId: string,
    limit: number,
  ): Promise<IUserDashboardProgramProjection[]> {
    const userObjectId = this.toObjectId(userId);

    if (!userObjectId || !Number.isFinite(limit) || limit < 1) {
      return [];
    }

    return UserProgramModel.aggregate<IUserDashboardProgramProjection>([
      {
        $match: {
          userId: userObjectId,
          status: "active",
          endDate: { $gt: new Date() },
        },
      },
      { $sort: { startDate: -1, _id: -1 } },
      { $limit: Math.floor(limit) },
      {
        $lookup: {
          from: "userplans",
          localField: "userPlanId",
          foreignField: "_id",
          as: "userPlan",
        },
      },
      { $unwind: "$userPlan" },
      {
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      { $unwind: "$nutritionist" },
      {
        $lookup: {
          from: UserProgramProgressModel.collection.name,
          localField: "_id",
          foreignField: "userProgramId",
          as: "progress",
        },
      },
      {
        $unwind: {
          path: "$progress",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          userPlanId: 1,
          planId: 1,
          nutritionistId: 1,
          title: "$userPlan.planSnapshot.title",
          nutritionist: {
            id: "$nutritionist._id",
            fullName: "$nutritionist.fullName",
            profileImage: "$nutritionist.profileImage",
          },
          startDate: 1,
          endDate: 1,
          durationDays: 1,
          status: 1,
          progress: {
            $cond: [
              { $ifNull: ["$progress._id", false] },
              {
                totalDays: "$progress.totalDays",
                completedDays: "$progress.completedDays",
                currentDay: {
                  $ifNull: ["$progress.currentDay", 1],
                },
                totalActivities: "$progress.totalActivities",
                completedActivities: "$progress.completedActivities",
                completionPercentage: "$progress.completionPercentage",
                currentStreak: "$progress.currentStreak",
              },
              null,
            ],
          },
        },
      },
    ]).exec();
  }

  async getTodayTracking(
    userId: string,
    date: Date,
  ): Promise<IUserDashboardTodayTrackingProjection[]> {
    const userObjectId = this.toObjectId(userId);

    if (!userObjectId || Number.isNaN(date.getTime())) {
      return [];
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    return UserDayTrackingModel.aggregate<IUserDashboardTodayTrackingProjection>(
      [
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        { $sort: { date: 1, dayNumber: 1, _id: 1 } },
        {
          $project: {
            _id: 1,
            userProgramId: 1,
            userProgramDayId: 1,
            dayNumber: 1,
            date: 1,
            status: 1,
            totalActivities: 1,
            completedActivities: 1,
            skippedActivities: 1,
            completionPercentage: 1,
          },
        },
      ],
    ).exec();
  }

  async getWeeklyProgress(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IUserDashboardWeeklyProgressProjection> {
    const emptyResult: IUserDashboardWeeklyProgressProjection = {
      completedDays: 0,
      totalTrackedDays: 0,
      completedActivities: 0,
      totalActivities: 0,
      dailyProgress: [],
    };

    const userObjectId = this.toObjectId(userId);

    if (
      !userObjectId ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate >= endDate
    ) {
      return emptyResult;
    }

    const [result] =
      await UserDayTrackingModel.aggregate<WeeklyProgressAggregation>([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startDate, $lt: endDate },
          },
        },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  completedDays: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
                    },
                  },
                  totalTrackedDays: { $sum: 1 },
                  completedActivities: { $sum: "$completedActivities" },
                  totalActivities: { $sum: "$totalActivities" },
                },
              },
              { $project: { _id: 0 } },
            ],
            dailyProgress: [
              {
                $group: {
                  _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" },
                    day: { $dayOfMonth: "$date" },
                  },
                  completedActivities: { $sum: "$completedActivities" },
                  totalActivities: { $sum: "$totalActivities" },
                },
              },
              {
                $project: {
                  _id: 0,
                  date: {
                    $dateFromParts: {
                      year: "$_id.year",
                      month: "$_id.month",
                      day: "$_id.day",
                    },
                  },
                  completedActivities: 1,
                  totalActivities: 1,
                },
              },
              { $sort: { date: 1 } },
            ],
          },
        },
      ]).exec();

    const summary = result?.summary[0];

    return {
      completedDays: summary?.completedDays ?? 0,
      totalTrackedDays: summary?.totalTrackedDays ?? 0,
      completedActivities: summary?.completedActivities ?? 0,
      totalActivities: summary?.totalActivities ?? 0,
      dailyProgress: result?.dailyProgress ?? [],
    };
  }

  async getUpcomingConsultations(
    userId: string,
    limit: number,
  ): Promise<IUserDashboardConsultationProjection[]> {
    const userObjectId = this.toObjectId(userId);

    if (!userObjectId || !Number.isFinite(limit) || limit < 1) {
      return [];
    }

    return MeetingModel.aggregate<IUserDashboardConsultationProjection>([
      {
        $match: {
          userId: userObjectId,
          status: "scheduled",
          scheduledAt: { $gte: new Date() },
          isDeleted: { $ne: true },
        },
      },
      { $sort: { scheduledAt: 1, _id: 1 } },
      { $limit: Math.floor(limit) },
      {
        $project: {
          _id: 1,
          title: 1,
          nutritionistId: 1,
          scheduledAt: 1,
          durationInMinutes: 1,
          status: 1,
        },
      },
    ]).exec();
  }

  async getPaymentOverview(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<IUserDashboardPaymentOverviewProjection | null> {
    const userObjectId = this.toObjectId(userId);

    if (
      !userObjectId ||
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate >= endDate
    ) {
      return null;
    }

    const [result] = await PaymentModel.aggregate<PaymentOverviewAggregation>([
      {
        $match: {
          userId: userObjectId,
          status: { $in: ["paid", "refunded"] },
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          amount: {
            $sum: {
              $max: [
                0,
                {
                  $subtract: ["$amount", { $ifNull: ["$refundedAmount", 0] }],
                },
              ],
            },
          },
          currency: { $first: "$currency" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: "$amount" },
          currency: { $first: "$currency" },
          monthlySpending: {
            $push: {
              year: "$_id.year",
              month: "$_id.month",
              amount: "$amount",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalSpent: 1,
          currency: 1,
          monthlySpending: 1,
        },
      },
    ]).exec();

    if (!result) {
      return {
        totalSpent: 0,
        monthlySpending: [],
        currency: CURRENCY,
      };
    }

    return result;
  }

  private toObjectId(userId: string): Types.ObjectId | null {
    return Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : null;
  }
}
