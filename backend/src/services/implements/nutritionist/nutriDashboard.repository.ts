import { injectable } from "inversify";
import { Types } from "mongoose";

import { UserProgramModel } from "../../../models/userProgram.model";
import { NutritionistPlanModel } from "../../../models/nutritionistPlan.model";
import { PaymentModel } from "../../../models/payment.model";
import { ConversationModel } from "../../../models/conversation.model";
import { ConversationMemberModel } from "../../../models/conversationMember.model";
import { ResourceModel } from "../../../models/resource.model";

import { INutritionistDashboardRepository } from "../../interfaces/nutritionist/INutriDashboardRepository";

import type { INutritionistDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutritionist-dashboard-overview.projection";

interface ProgramOverviewFacetResult {
  total: { count: number }[];
  totalClients: { count: number }[];
  activeClients: { count: number }[];
  upcoming: { count: number }[];
  active: { count: number }[];
  paused: { count: number }[];
  completed: { count: number }[];
  cancelled: { count: number }[];
}

interface ProgramOverviewResult {
  total: number;
  totalClients: number;
  activeClients: number;
  upcoming: number;
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
}

interface PlanOverviewResult {
  published: number;
}

interface GroupOverviewResult {
  total: number;
  totalMembers: number;
}

interface ResourceOverviewResult {
  published: number;
  totalViews: number;
  totalDownloads: number;
}

interface RecentProgramDocument {
  createdAt: Date;
  status: "upcoming" | "active" | "paused" | "completed" | "cancelled";
}

interface CompletedProgramDocument {
  completedAt?: Date;
}

interface RecentPurchaseDocument {
  createdAt: Date;
  itemSnapshot?: {
    title?: string;
  };
}

interface RecentGroupDocument {
  createdAt: Date;
}

interface RecentResourceDocument {
  title: string;
  publishedAt?: Date;
}

interface ActivityDocument {
  type:
    | "client_joined"
    | "program_started"
    | "program_completed"
    | "plan_purchased"
    | "group_created"
    | "resource_published";

  title: string;
  createdAt: Date;
}

@injectable()
export class NutritionistDashboardRepository implements INutritionistDashboardRepository {
  async getOverview(
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutritionistDashboardOverviewProjection> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const [
      programOverview,
      planOverview,
      planPurchaseCount,
      groupOverview,
      resourceOverview,
      recentActivity,
    ] = await Promise.all([
      this.getProgramOverview(nutritionistObjectId),
      this.getPlanOverview(nutritionistObjectId),
      this.getPlanPurchaseCount(nutritionistObjectId),
      this.getGroupOverview(nutritionistObjectId),
      this.getResourceOverview(nutritionistObjectId),
      this.getRecentActivity(nutritionistObjectId),
    ]);

    return {
      summary: {
        totalClients: programOverview.totalClients,
        activeClients: programOverview.activeClients,
        totalPrograms: programOverview.total,
        activePrograms: programOverview.active,
        publishedPlans: planOverview.published,
        totalPlanPurchases: planPurchaseCount,
        totalGroups: groupOverview.total,
        publishedResources: resourceOverview.published,
      },

      programs: {
        upcoming: programOverview.upcoming,
        active: programOverview.active,
        paused: programOverview.paused,
        completed: programOverview.completed,
        cancelled: programOverview.cancelled,
      },

      groups: {
        total: groupOverview.total,
        totalMembers: groupOverview.totalMembers,
      },

      resources: {
        published: resourceOverview.published,
        totalViews: resourceOverview.totalViews,
        totalDownloads: resourceOverview.totalDownloads,
      },

      recentActivity,
    };
  }

  private async getProgramOverview(
    nutritionistId: Types.ObjectId,
  ): Promise<ProgramOverviewResult> {
    const result = await UserProgramModel.aggregate<ProgramOverviewFacetResult>(
      [
        {
          $match: {
            nutritionistId,
            isDeleted: false,
          },
        },
        {
          $facet: {
            total: [
              {
                $count: "count",
              },
            ],

            totalClients: [
              {
                $group: {
                  _id: "$userId",
                },
              },
              {
                $count: "count",
              },
            ],

            activeClients: [
              {
                $match: {
                  status: "active",
                },
              },
              {
                $group: {
                  _id: "$userId",
                },
              },
              {
                $count: "count",
              },
            ],

            upcoming: [
              {
                $match: {
                  status: "upcoming",
                },
              },
              {
                $count: "count",
              },
            ],

            active: [
              {
                $match: {
                  status: "active",
                },
              },
              {
                $count: "count",
              },
            ],

            paused: [
              {
                $match: {
                  status: "paused",
                },
              },
              {
                $count: "count",
              },
            ],

            completed: [
              {
                $match: {
                  status: "completed",
                },
              },
              {
                $count: "count",
              },
            ],

            cancelled: [
              {
                $match: {
                  status: "cancelled",
                },
              },
              {
                $count: "count",
              },
            ],
          },
        },
      ],
    );

    const data = result[0];

    return {
      total: data?.total[0]?.count ?? 0,
      totalClients: data?.totalClients[0]?.count ?? 0,
      activeClients: data?.activeClients[0]?.count ?? 0,
      upcoming: data?.upcoming[0]?.count ?? 0,
      active: data?.active[0]?.count ?? 0,
      paused: data?.paused[0]?.count ?? 0,
      completed: data?.completed[0]?.count ?? 0,
      cancelled: data?.cancelled[0]?.count ?? 0,
    };
  }

  private async getPlanOverview(
    nutritionistId: Types.ObjectId,
  ): Promise<PlanOverviewResult> {
    const result = await NutritionistPlanModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          nutritionistId,
          status: "published",
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

  private async getPlanPurchaseCount(
    nutritionistId: Types.ObjectId,
  ): Promise<number> {
    const result = await PaymentModel.aggregate<{
      count: number;
    }>([
      {
        $match: {
          resourceType: "nutritionist_plan",
          status: "paid",
          "metadata.nutritionistId": nutritionistId.toString(),
        },
      },
      {
        $count: "count",
      },
    ]);

    return result[0]?.count ?? 0;
  }

  private async getGroupOverview(
    nutritionistId: Types.ObjectId,
  ): Promise<GroupOverviewResult> {
    const result = await ConversationMemberModel.aggregate<{
      total: number;
      totalMembers: number;
    }>([
      {
        $match: {
          userId: nutritionistId,
          role: "owner",
          status: "active",
        },
      },
      {
        $lookup: {
          from: ConversationModel.collection.name,
          localField: "conversationId",
          foreignField: "_id",
          as: "conversation",
        },
      },
      {
        $unwind: "$conversation",
      },
      {
        $match: {
          "conversation.chatType": "group",
          "conversation.purpose": "group_coaching",
        },
      },
      {
        $lookup: {
          from: ConversationMemberModel.collection.name,
          let: {
            groupId: "$conversation._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$conversationId", "$$groupId"],
                    },
                    {
                      $eq: ["$status", "active"],
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "memberStats",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          totalMembers: {
            $sum: {
              $ifNull: [
                {
                  $arrayElemAt: ["$memberStats.count", 0],
                },
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          totalMembers: 1,
        },
      },
    ]);

    return {
      total: result[0]?.total ?? 0,
      totalMembers: result[0]?.totalMembers ?? 0,
    };
  }

  private async getResourceOverview(
    nutritionistId: Types.ObjectId,
  ): Promise<ResourceOverviewResult> {
    const result = await ResourceModel.aggregate<ResourceOverviewResult>([
      {
        $match: {
          createdBy: nutritionistId,
        },
      },
      {
        $group: {
          _id: null,

          published: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "published"],
                },
                1,
                0,
              ],
            },
          },

          totalViews: {
            $sum: {
              $ifNull: ["$viewCount", 0],
            },
          },

          totalDownloads: {
            $sum: {
              $ifNull: ["$downloadCount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          published: 1,
          totalViews: 1,
          totalDownloads: 1,
        },
      },
    ]);

    return {
      published: result[0]?.published ?? 0,
      totalViews: result[0]?.totalViews ?? 0,
      totalDownloads: result[0]?.totalDownloads ?? 0,
    };
  }

  private async getRecentActivity(
    nutritionistId: Types.ObjectId,
  ): Promise<INutritionistDashboardOverviewProjection["recentActivity"]> {
    const [programs, completedPrograms, purchases, groups, resources] =
      await Promise.all([
        UserProgramModel.find({
          nutritionistId,
          isDeleted: false,
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .select({
            createdAt: 1,
            status: 1,
          })
          .lean<RecentProgramDocument[]>()
          .exec(),

        UserProgramModel.find({
          nutritionistId,
          isDeleted: false,
          status: "completed",
          completedAt: {
            $exists: true,
          },
        })
          .sort({ completedAt: -1 })
          .limit(5)
          .select({
            completedAt: 1,
          })
          .lean<CompletedProgramDocument[]>()
          .exec(),

        PaymentModel.find({
          resourceType: "nutritionist_plan",
          status: "paid",
          "metadata.nutritionistId": nutritionistId.toString(),
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .select({
            createdAt: 1,
            itemSnapshot: 1,
          })
          .lean<RecentPurchaseDocument[]>()
          .exec(),

        ConversationMemberModel.aggregate<RecentGroupDocument>([
          {
            $match: {
              userId: nutritionistId,
              role: "owner",
              status: "active",
            },
          },
          {
            $lookup: {
              from: ConversationModel.collection.name,
              localField: "conversationId",
              foreignField: "_id",
              as: "conversation",
            },
          },
          {
            $unwind: "$conversation",
          },
          {
            $match: {
              "conversation.chatType": "group",
              "conversation.purpose": "group_coaching",
            },
          },
          {
            $sort: {
              "conversation.createdAt": -1,
            },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              _id: 0,
              createdAt: "$conversation.createdAt",
            },
          },
        ]).exec(),

        ResourceModel.find({
          createdBy: nutritionistId,
          status: "published",
          publishedAt: {
            $exists: true,
          },
        })
          .sort({ publishedAt: -1 })
          .limit(5)
          .select({
            title: 1,
            publishedAt: 1,
          })
          .lean<RecentResourceDocument[]>()
          .exec(),
      ]);

    const activities: ActivityDocument[] = [
      ...programs.map((program) => ({
        type:
          program.status === "active"
            ? ("program_started" as const)
            : ("client_joined" as const),
        title:
          program.status === "active"
            ? "A client started a program"
            : "A new client joined",
        createdAt: program.createdAt,
      })),

      ...completedPrograms
        .filter(
          (program): program is { completedAt: Date } =>
            program.completedAt instanceof Date,
        )
        .map((program) => ({
          type: "program_completed" as const,
          title: "A client completed a program",
          createdAt: program.completedAt,
        })),

      ...purchases.map((purchase) => ({
        type: "plan_purchased" as const,
        title: purchase.itemSnapshot?.title
          ? `${purchase.itemSnapshot.title} was purchased`
          : "A coaching plan was purchased",
        createdAt: purchase.createdAt,
      })),

      ...groups.map((group) => ({
        type: "group_created" as const,
        title: "A coaching group was created",
        createdAt: group.createdAt,
      })),

      ...resources
        .filter(
          (
            resource,
          ): resource is {
            title: string;
            publishedAt: Date;
          } => resource.publishedAt instanceof Date,
        )
        .map((resource) => ({
          type: "resource_published" as const,
          title: `${resource.title} was published`,
          createdAt: resource.publishedAt,
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
