import { injectable } from "inversify";

import { UserModel } from "../../../models/user.model";
import { NutritionistProfileModel } from "../../../models/nutritionistProfile.model";
import { NutritionistPlanModel } from "../../../models/nutritionistPlan.model";
import { PaymentModel } from "../../../models/payment.model";
import { ChallengeModel } from "../../../models/challenge.model";
import { UserProgramModel } from "../../../models/userProgram.model";

import { IAdminDashboardRepository } from "../../interfaces/admin/IAdminDashboardRepository";
import { IAdminDashboardOverviewProjection } from "../../../types/admin/dashboard/admin-dashboard-overview.projection";

interface CountResult {
  count: number;
}

interface TrendResult {
  date: string;
  value: number;
}

interface ChallengeStatusResult {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

interface PaymentOverviewResult {
  purchases: number;
  revenue: number;
}

interface AttentionItem {
  type: "nutritionist_application" | "challenge" | "user" | "payment";
  title: string;
  count: number;
  action: string;
}

interface ActivityItem {
  type:
    | "user_registered"
    | "nutritionist_application"
    | "nutritionist_approved"
    | "challenge_published"
    | "purchase_completed";
  title: string;
  createdAt: Date;
}

@injectable()
export class AdminDashboardRepository implements IAdminDashboardRepository {
  async getOverview(): Promise<IAdminDashboardOverviewProjection> {
    const [
      userOverview,
      nutritionistOverview,
      challengeOverview,
      planOverview,
      paymentOverview,
      programOverview,
      userTrend,
      revenueTrend,
      nutritionistTrend,
      attention,
      recentActivity,
    ] = await Promise.all([
      this.getUserOverview(),
      this.getNutritionistOverview(),
      this.getChallengeOverview(),
      this.getPlanOverview(),
      this.getPaymentOverview(),
      this.getProgramOverview(),
      this.getUserTrend(),
      this.getRevenueTrend(),
      this.getNutritionistTrend(),
      this.getAttentionItems(),
      this.getRecentActivity(),
    ]);

    return {
      summary: {
        totalUsers: userOverview.total,
        totalNutritionists: nutritionistOverview.total,
        pendingNutritionistApplications: nutritionistOverview.pending,
        totalPurchases: paymentOverview.purchases,
        totalRevenue: paymentOverview.revenue,
      },

      nutritionists: {
        approved: nutritionistOverview.approved,
        pending: nutritionistOverview.pending,
        rejected: nutritionistOverview.rejected,
        blocked: nutritionistOverview.blocked,
      },

      challenges: challengeOverview,

      coaching: {
        publishedPlans: planOverview.published,
        purchases: paymentOverview.purchases,
        activePrograms: programOverview.active,
      },

      trends: {
        users: userTrend,
        revenue: revenueTrend,
        nutritionists: nutritionistTrend,
      },

      attention,

      recentActivity,
    };
  }

  private async getUserOverview(): Promise<{
    total: number;
  }> {
    const result = await UserModel.aggregate<CountResult>([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $count: "count",
      },
    ]);

    return {
      total: result[0]?.count ?? 0,
    };
  }

  private async getNutritionistOverview(): Promise<{
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    blocked: number;
  }> {
    const result = await NutritionistProfileModel.aggregate<{
      total: number;
      approved: number;
      pending: number;
      rejected: number;
      blocked: number;
    }>([
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.deletedAt": null,
        },
      },
      {
        $facet: {
          total: [
            {
              $count: "count",
            },
          ],

          approved: [
            {
              $match: {
                applicationStatus: "approved",
              },
            },
            {
              $count: "count",
            },
          ],

          pending: [
            {
              $match: {
                applicationStatus: "pending",
              },
            },
            {
              $count: "count",
            },
          ],

          rejected: [
            {
              $match: {
                applicationStatus: "rejected",
              },
            },
            {
              $count: "count",
            },
          ],

          blocked: [
            {
              $match: {
                "user.isBlocked": true,
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          total: {
            $ifNull: [
              {
                $arrayElemAt: ["$total.count", 0],
              },
              0,
            ],
          },
          approved: {
            $ifNull: [
              {
                $arrayElemAt: ["$approved.count", 0],
              },
              0,
            ],
          },
          pending: {
            $ifNull: [
              {
                $arrayElemAt: ["$pending.count", 0],
              },
              0,
            ],
          },
          rejected: {
            $ifNull: [
              {
                $arrayElemAt: ["$rejected.count", 0],
              },
              0,
            ],
          },
          blocked: {
            $ifNull: [
              {
                $arrayElemAt: ["$blocked.count", 0],
              },
              0,
            ],
          },
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

  private async getChallengeOverview(): Promise<ChallengeStatusResult> {
    const result = await ChallengeModel.aggregate<ChallengeStatusResult>([
      {
        $facet: {
          total: [
            {
              $count: "count",
            },
          ],

          published: [
            {
              $match: {
                status: "published",
              },
            },
            {
              $count: "count",
            },
          ],

          draft: [
            {
              $match: {
                status: "draft",
              },
            },
            {
              $count: "count",
            },
          ],

          archived: [
            {
              $match: {
                status: "archived",
              },
            },
            {
              $count: "count",
            },
          ],
        },
      },
      {
        $project: {
          total: {
            $ifNull: [
              {
                $arrayElemAt: ["$total.count", 0],
              },
              0,
            ],
          },
          published: {
            $ifNull: [
              {
                $arrayElemAt: ["$published.count", 0],
              },
              0,
            ],
          },
          draft: {
            $ifNull: [
              {
                $arrayElemAt: ["$draft.count", 0],
              },
              0,
            ],
          },
          archived: {
            $ifNull: [
              {
                $arrayElemAt: ["$archived.count", 0],
              },
              0,
            ],
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

  private async getPlanOverview(): Promise<{
    published: number;
  }> {
    const result = await NutritionistPlanModel.aggregate<CountResult>([
      {
        $match: {
          status: "published",
          isDeleted: false,
        },
      },
      {
        $count: "count",
      },
    ]);

    return {
      published: result[0]?.count ?? 0,
    };
  }

  private async getPaymentOverview(): Promise<PaymentOverviewResult> {
    const result = await PaymentModel.aggregate<{
      purchases: number;
      revenue: number;
    }>([
      {
        $match: {
          resourceType: "nutritionist_plan",
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          purchases: {
            $sum: 1,
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          purchases: 1,
          revenue: 1,
        },
      },
    ]);

    return {
      purchases: result[0]?.purchases ?? 0,
      revenue: result[0]?.revenue ?? 0,
    };
  }

  private async getProgramOverview(): Promise<{
    active: number;
  }> {
    const result = await UserProgramModel.aggregate<CountResult>([
      {
        $match: {
          status: "active",
          isDeleted: false,
        },
      },
      {
        $count: "count",
      },
    ]);

    return {
      active: result[0]?.count ?? 0,
    };
  }

  private async getUserTrend(): Promise<TrendResult[]> {
    const result = await UserModel.aggregate<TrendResult>([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          value: 1,
        },
      },
    ]);

    return result;
  }

  private async getRevenueTrend(): Promise<TrendResult[]> {
    const result = await PaymentModel.aggregate<TrendResult>([
      {
        $match: {
          resourceType: "nutritionist_plan",
          status: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          value: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          value: 1,
        },
      },
    ]);

    return result;
  }

  private async getNutritionistTrend(): Promise<TrendResult[]> {
    const result = await NutritionistProfileModel.aggregate<TrendResult>([
      {
        $match: {
          applicationStatus: "approved",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          value: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          value: 1,
        },
      },
    ]);

    return result;
  }

  private async getAttentionItems(): Promise<AttentionItem[]> {
    const [pendingApplications, draftChallenges, failedPayments, blockedUsers] =
      await Promise.all([
        NutritionistProfileModel.countDocuments({
          applicationStatus: "pending",
        }),

        ChallengeModel.countDocuments({
          status: "draft",
        }),

        PaymentModel.countDocuments({
          status: "failed",
        }),

        UserModel.countDocuments({
          isBlocked: true,
          deletedAt: null,
        }),
      ]);

    const items: AttentionItem[] = [];

    if (pendingApplications > 0) {
      items.push({
        type: "nutritionist_application",
        title: "Nutritionist applications waiting for review",
        count: pendingApplications,
        action: "Review",
      });
    }

    if (draftChallenges > 0) {
      items.push({
        type: "challenge",
        title: "Challenges are still in draft",
        count: draftChallenges,
        action: "Manage",
      });
    }

    if (failedPayments > 0) {
      items.push({
        type: "payment",
        title: "Failed payments require attention",
        count: failedPayments,
        action: "View",
      });
    }

    if (blockedUsers > 0) {
      items.push({
        type: "user",
        title: "Blocked user accounts",
        count: blockedUsers,
        action: "View",
      });
    }

    return items;
  }

  private async getRecentActivity(): Promise<ActivityItem[]> {
    const [
      users,
      applications,
      approvedNutritionists,
      publishedChallenges,
      purchases,
    ] = await Promise.all([
      UserModel.find({
        deletedAt: null,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select({
          createdAt: 1,
          fullName: 1,
        })
        .lean(),

      NutritionistProfileModel.find({
        applicationStatus: "pending",
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select({
          createdAt: 1,
        })
        .lean(),

      NutritionistProfileModel.find({
        applicationStatus: "approved",
      })
        .sort({
          updatedAt: -1,
        })
        .limit(5)
        .select({
          updatedAt: 1,
        })
        .lean(),

      ChallengeModel.find({
        status: "published",
      })
        .sort({
          updatedAt: -1,
        })
        .limit(5)
        .select({
          title: 1,
          updatedAt: 1,
        })
        .lean(),

      PaymentModel.find({
        resourceType: "nutritionist_plan",
        status: "paid",
      })
        .sort({
          createdAt: -1,
        })
        .limit(5)
        .select({
          createdAt: 1,
          itemSnapshot: 1,
        })
        .lean(),
    ]);

    const activities: ActivityItem[] = [
      ...users.map((user) => ({
        type: "user_registered" as const,
        title: `${user.fullName} registered`,
        createdAt: user.createdAt,
      })),

      ...applications.map((application) => ({
        type: "nutritionist_application" as const,
        title: "New nutritionist application received",
        createdAt: application.createdAt,
      })),

      ...approvedNutritionists.map((nutritionist) => ({
        type: "nutritionist_approved" as const,
        title: "Nutritionist application approved",
        createdAt: nutritionist.updatedAt,
      })),

      ...publishedChallenges.map((challenge) => ({
        type: "challenge_published" as const,
        title: `${challenge.title} published`,
        createdAt: challenge.updatedAt,
      })),

      ...purchases.map((purchase) => ({
        type: "purchase_completed" as const,
        title: `${purchase.itemSnapshot.title} purchased`,
        createdAt: purchase.createdAt,
      })),
    ];

    return activities
      .sort(
        (first, second) =>
          second.createdAt.getTime() - first.createdAt.getTime(),
      )
      .slice(0, 8);
  }
}
