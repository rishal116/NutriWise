import { UserModel } from "../../../../models/user.model";
import { NutritionistProfileModel } from "../../../../models/nutritionistProfile.model";
import { NutritionistPlanModel } from "../../../../models/nutritionistPlan.model";
import { PaymentModel } from "../../../../models/payment.model";
import { ChallengeModel } from "../../../../models/challenge.model";
import { UserProgramModel } from "../../../../models/userProgram.model";

import type {
  AdminDashboardSummary,
  AdminDashboardNutritionistStats,
  AdminDashboardChallengeStats,
  AdminDashboardCoachingStats,
} from "../../../../types/admin/dashboard/admin-dashboard.types";

interface CountResult {
  count: number;
}

interface UserStats {
  total: number;
  newUsers: number;
  blockedUsers: number;
  deletedUsers: number;
  unverifiedUsers: number;
}

interface NutritionistStats extends AdminDashboardNutritionistStats {
  total: number;
}

interface PaymentStats {
  purchases: number;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  commissionEarned: number;
}

interface ProgramStats {
  upcoming: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
}

export interface AdminDashboardStats {
  summary: AdminDashboardSummary;
  nutritionists: AdminDashboardNutritionistStats;
  challenges: AdminDashboardChallengeStats;
  coaching: AdminDashboardCoachingStats;
}

export async function getDashboardStats(
  startDate: Date,
): Promise<AdminDashboardStats> {
  const [users, nutritionists, challenges, publishedPlans, payments, programs] =
    await Promise.all([
      getUserStats(startDate),
      getNutritionistStats(),
      getChallengeStats(),
      getPublishedPlanCount(),
      getPaymentStats(),
      getProgramStats(),
    ]);

  return {
    summary: {
      totalUsers: users.total,
      newUsers: users.newUsers,
      blockedUsers: users.blockedUsers,
      deletedUsers: users.deletedUsers,
      unverifiedUsers: users.unverifiedUsers,
      totalNutritionists: nutritionists.total,
      pendingNutritionistApplications: nutritionists.pending,
      totalPurchases: payments.purchases,
      totalRevenue: payments.grossRevenue,
      refundedAmount: payments.refundedAmount,
      netRevenue: payments.netRevenue,
      commissionEarned: payments.commissionEarned,
    },
    nutritionists: {
      approved: nutritionists.approved,
      pending: nutritionists.pending,
      rejected: nutritionists.rejected,
      blocked: nutritionists.blocked,
    },
    challenges,
    coaching: {
      publishedPlans,
      purchases: payments.purchases,
      activePrograms: programs.active,
      upcomingPrograms: programs.upcoming,
      pausedPrograms: programs.paused,
      completedPrograms: programs.completed,
      cancelledPrograms: programs.cancelled,
    },
  };
}

async function getUserStats(startDate: Date): Promise<UserStats> {
  const result = await UserModel.aggregate<UserStats>([
    {
      $facet: {
        active: [
          { $match: { deletedAt: null } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              newUsers: {
                $sum: {
                  $cond: [{ $gte: ["$createdAt", startDate] }, 1, 0],
                },
              },
              blockedUsers: {
                $sum: { $cond: ["$isBlocked", 1, 0] },
              },
              unverifiedUsers: {
                $sum: {
                  $cond: [{ $eq: ["$emailVerifiedAt", null] }, 1, 0],
                },
              },
            },
          },
        ],
        deleted: [
          { $match: { deletedAt: { $ne: null } } },
          { $count: "count" },
        ],
      },
    },
    {
      $project: {
        _id: 0,
        total: {
          $ifNull: [{ $arrayElemAt: ["$active.total", 0] }, 0],
        },
        newUsers: {
          $ifNull: [{ $arrayElemAt: ["$active.newUsers", 0] }, 0],
        },
        blockedUsers: {
          $ifNull: [{ $arrayElemAt: ["$active.blockedUsers", 0] }, 0],
        },
        unverifiedUsers: {
          $ifNull: [{ $arrayElemAt: ["$active.unverifiedUsers", 0] }, 0],
        },
        deletedUsers: {
          $ifNull: [{ $arrayElemAt: ["$deleted.count", 0] }, 0],
        },
      },
    },
  ]);

  return (
    result[0] ?? {
      total: 0,
      newUsers: 0,
      blockedUsers: 0,
      deletedUsers: 0,
      unverifiedUsers: 0,
    }
  );
}

async function getNutritionistStats(): Promise<NutritionistStats> {
  const result = await NutritionistProfileModel.aggregate<NutritionistStats>([
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    { $match: { "user.deletedAt": null } },
    {
      $facet: {
        total: [{ $count: "count" }],
        approved: [
          { $match: { applicationStatus: "approved" } },
          { $count: "count" },
        ],
        pending: [
          { $match: { applicationStatus: "pending" } },
          { $count: "count" },
        ],
        rejected: [
          { $match: { applicationStatus: "rejected" } },
          { $count: "count" },
        ],
        blocked: [{ $match: { "user.isBlocked": true } }, { $count: "count" }],
      },
    },
    {
      $project: {
        _id: 0,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
        approved: { $ifNull: [{ $arrayElemAt: ["$approved.count", 0] }, 0] },
        pending: { $ifNull: [{ $arrayElemAt: ["$pending.count", 0] }, 0] },
        rejected: { $ifNull: [{ $arrayElemAt: ["$rejected.count", 0] }, 0] },
        blocked: { $ifNull: [{ $arrayElemAt: ["$blocked.count", 0] }, 0] },
      },
    },
  ]);

  return (
    result[0] ?? {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      blocked: 0,
    }
  );
}

async function getChallengeStats(): Promise<AdminDashboardChallengeStats> {
  const result = await ChallengeModel.aggregate<AdminDashboardChallengeStats>([
    {
      $facet: {
        total: [{ $count: "count" }],
        published: [{ $match: { status: "published" } }, { $count: "count" }],
        draft: [{ $match: { status: "draft" } }, { $count: "count" }],
        archived: [{ $match: { status: "archived" } }, { $count: "count" }],
      },
    },
    {
      $project: {
        _id: 0,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
        published: {
          $ifNull: [{ $arrayElemAt: ["$published.count", 0] }, 0],
        },
        draft: { $ifNull: [{ $arrayElemAt: ["$draft.count", 0] }, 0] },
        archived: {
          $ifNull: [{ $arrayElemAt: ["$archived.count", 0] }, 0],
        },
      },
    },
  ]);

  return (
    result[0] ?? {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
    }
  );
}

async function getPublishedPlanCount(): Promise<number> {
  const result = await NutritionistPlanModel.aggregate<CountResult>([
    { $match: { status: "published", isDeleted: false } },
    { $count: "count" },
  ]);

  return result[0]?.count ?? 0;
}

async function getPaymentStats(): Promise<PaymentStats> {
  const result = await PaymentModel.aggregate<PaymentStats>([
    {
      $match: {
        resourceType: "nutritionist_plan",
        status: { $in: ["paid", "refunded"] },
      },
    },
    {
      $group: {
        _id: null,
        purchases: { $sum: 1 },
        grossRevenue: { $sum: "$amount" },
        refundedAmount: {
          $sum: { $ifNull: ["$refundedAmount", 0] },
        },
        commissionEarned: { $sum: "$commissionAmount" },
      },
    },
    {
      $project: {
        _id: 0,
        purchases: 1,
        grossRevenue: 1,
        refundedAmount: 1,
        netRevenue: { $subtract: ["$grossRevenue", "$refundedAmount"] },
        commissionEarned: 1,
      },
    },
  ]);

  return (
    result[0] ?? {
      purchases: 0,
      grossRevenue: 0,
      refundedAmount: 0,
      netRevenue: 0,
      commissionEarned: 0,
    }
  );
}

async function getProgramStats(): Promise<ProgramStats> {
  const result = await UserProgramModel.aggregate<ProgramStats>([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        upcoming: {
          $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
        },
        active: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
        paused: {
          $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] },
        },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        upcoming: 1,
        active: 1,
        paused: 1,
        completed: 1,
        cancelled: 1,
      },
    },
  ]);

  return (
    result[0] ?? {
      upcoming: 0,
      active: 0,
      paused: 0,
      completed: 0,
      cancelled: 0,
    }
  );
}
