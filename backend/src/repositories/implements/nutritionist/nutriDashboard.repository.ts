import { injectable } from "inversify";
import { Types } from "mongoose";

import { UserProgramModel } from "../../../models/userProgram.model";
import { NutritionistPlanModel } from "../../../models/nutritionistPlan.model";
import { PaymentModel } from "../../../models/payment.model";
import { ConversationModel } from "../../../models/conversation.model";
import { ConversationMemberModel } from "../../../models/conversationMember.model";
import { ResourceModel } from "../../../models/resource.model";
import { MeetingModel } from "../../../models/meeting.model";
import { SessionModel } from "../../../models/session.model";
import { Review } from "../../../models/review.model";
import type { INutriDashboardEarningsChartProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-earnings-chart.projection";
import type { INutriDashboardRecentActivityItemProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-recent-activity.projection";
import { INutriDashboardRepository } from "../../interfaces/nutritionist/INutriDashboardRepository";
import type { INutriDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-overview.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { UserModel } from "../../../models/user.model";

@injectable()
export class NutriDashboardRepository implements INutriDashboardRepository {
  async getOverview(
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriDashboardOverviewProjection> {
    const id =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      programs,
      plans,
      meetings,
      sessions,
      reviews,
      resources,
      groups,
      earnings,
    ] = await Promise.all([
      UserProgramModel.aggregate<{
        upcoming: number;
        active: number;
        paused: number;
        completed: number;
        cancelled: number;
        totalClients: number;
        activeClients: number;
      }>([
        { $match: { nutritionistId: id, isDeleted: false } },
        {
          $group: {
            _id: null,
            upcoming: {
              $sum: { $cond: [{ $eq: ["$status", "upcoming"] }, 1, 0] },
            },
            active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            paused: { $sum: { $cond: [{ $eq: ["$status", "paused"] }, 1, 0] } },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
            users: { $addToSet: "$userId" },
            activeUsers: {
              $addToSet: {
                $cond: [{ $eq: ["$status", "active"] }, "$userId", null],
              },
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
            totalClients: { $size: "$users" },
            activeClients: {
              $size: {
                $filter: {
                  input: "$activeUsers",
                  as: "userId",
                  cond: { $ne: ["$$userId", null] },
                },
              },
            },
          },
        },
      ]),

      NutritionistPlanModel.aggregate<{
        published: number;
        draft: number;
      }>([
        { $match: { nutritionistId: id, isDeleted: { $ne: true } } },
        {
          $group: {
            _id: null,
            published: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          },
        },
        { $project: { _id: 0, published: 1, draft: 1 } },
      ]),

      MeetingModel.aggregate<{
        upcoming: number;
        ongoing: number;
        completed: number;
        cancelled: number;
      }>([
        { $match: { nutritionistId: id, isDeleted: false } },
        {
          $group: {
            _id: null,
            upcoming: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ["$status", "scheduled"] },
                      { $gt: ["$scheduledAt", now] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            ongoing: {
              $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] },
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
            ongoing: 1,
            completed: 1,
            cancelled: 1,
          },
        },
      ]),

      SessionModel.aggregate<{
        draft: number;
        scheduled: number;
        live: number;
        completed: number;
        cancelled: number;
      }>([
        { $match: { nutritionistId: id } },
        {
          $group: {
            _id: null,
            draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
            scheduled: {
              $sum: { $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0] },
            },
            live: { $sum: { $cond: [{ $eq: ["$status", "live"] }, 1, 0] } },
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
            draft: 1,
            scheduled: 1,
            live: 1,
            completed: 1,
            cancelled: 1,
          },
        },
      ]),

      Review.aggregate<{ total: number; averageRating: number }>([
        { $match: { nutritionist: id, isDeleted: false } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            averageRating: { $avg: "$rating" },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            averageRating: { $round: [{ $ifNull: ["$averageRating", 0] }, 1] },
          },
        },
      ]),

      ResourceModel.aggregate<{
        total: number;
        published: number;
        draft: number;
      }>([
        { $match: { createdBy: id } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            draft: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
          },
        },
        { $project: { _id: 0, total: 1, published: 1, draft: 1 } },
      ]),

      ConversationMemberModel.aggregate<{
        total: number;
        active: number;
        inactive: number;
      }>([
        { $match: { userId: id, role: "owner", status: "active" } },
        {
          $lookup: {
            from: ConversationModel.collection.name,
            localField: "conversationId",
            foreignField: "_id",
            as: "conversation",
          },
        },
        { $unwind: "$conversation" },
        {
          $match: {
            "conversation.chatType": "group",
            "conversation.purpose": "group_coaching",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: {
                $cond: [{ $eq: ["$conversation.status", "active"] }, 1, 0],
              },
            },
            inactive: {
              $sum: {
                $cond: [{ $eq: ["$conversation.status", "inactive"] }, 1, 0],
              },
            },
          },
        },
        { $project: { _id: 0, total: 1, active: 1, inactive: 1 } },
      ]),

      PaymentModel.aggregate<{
        total: number;
        thisMonth: number;
      }>([
        {
          $match: {
            resourceType: "nutritionist_plan",
            status: "paid",
            sellerId: id,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            thisMonth: {
              $sum: {
                $cond: [{ $gte: ["$createdAt", monthStart] }, "$amount", 0],
              },
            },
          },
        },
        { $project: { _id: 0, total: 1, thisMonth: 1 } },
      ]),
    ]);

    return {
      clients: {
        total: programs[0]?.totalClients ?? 0,
        active: programs[0]?.activeClients ?? 0,
      },
      earnings: {
        total: earnings[0]?.total ?? 0,
        thisMonth: earnings[0]?.thisMonth ?? 0,
        currency: "INR",
      },
      plans: {
        published: plans[0]?.published ?? 0,
        draft: plans[0]?.draft ?? 0,
      },
      programs: {
        upcoming: programs[0]?.upcoming ?? 0,
        active: programs[0]?.active ?? 0,
        paused: programs[0]?.paused ?? 0,
        completed: programs[0]?.completed ?? 0,
        cancelled: programs[0]?.cancelled ?? 0,
      },
      meetings: {
        upcoming: meetings[0]?.upcoming ?? 0,
        ongoing: meetings[0]?.ongoing ?? 0,
        completed: meetings[0]?.completed ?? 0,
        cancelled: meetings[0]?.cancelled ?? 0,
      },
      sessions: {
        draft: sessions[0]?.draft ?? 0,
        scheduled: sessions[0]?.scheduled ?? 0,
        live: sessions[0]?.live ?? 0,
        completed: sessions[0]?.completed ?? 0,
        cancelled: sessions[0]?.cancelled ?? 0,
      },
      reviews: {
        total: reviews[0]?.total ?? 0,
        averageRating: reviews[0]?.averageRating ?? 0,
      },
      resources: {
        total: resources[0]?.total ?? 0,
        published: resources[0]?.published ?? 0,
        draft: resources[0]?.draft ?? 0,
      },
      groups: {
        total: groups[0]?.total ?? 0,
        active: groups[0]?.active ?? 0,
        inactive: groups[0]?.inactive ?? 0,
      },
    };
  }

  async getEarningsChart(
    nutritionistId: string | Types.ObjectId,
    months = 6,
  ): Promise<INutriDashboardEarningsChartProjection> {
    const id =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const from = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - Math.max(1, months - 1),
      1,
    );

    const results = await PaymentModel.aggregate<{
      _id: string;
      earnings: number;
      transactions: number;
    }>([
      {
        $match: {
          sellerId: id,
          resourceType: "nutritionist_plan",
          status: "paid",
          createdAt: { $gte: from, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          earnings: { $sum: "$amount" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyResults = new Map(
      results.map((result) => [
        result._id,
        {
          earnings: result.earnings,
          transactions: result.transactions,
        },
      ]),
    );

    const data = Array.from({ length: Math.max(1, months) }, (_, index) => {
      const date = new Date(from.getFullYear(), from.getMonth() + index, 1);
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;
      const result = monthlyResults.get(month);

      return {
        month,
        year: date.getFullYear(),
        earnings: result?.earnings ?? 0,
        transactions: result?.transactions ?? 0,
      };
    });

    return {
      currency: "INR",
      period: { from, to: now },
      data,
    };
  }

  async getRecentActivities(
    nutritionistId: string | Types.ObjectId,
    limit = 5,
    cursor?: string,
  ): Promise<CursorPaginationResult<INutriDashboardRecentActivityItemProjection>> {
    const id =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const pageSize = Math.min(Math.max(1, Math.floor(limit)), 20);
    const cursorData = decodeCursor(cursor);

    const cursorDate = cursorData ? new Date(cursorData.value) : null;

    if (cursorDate && Number.isNaN(cursorDate.getTime())) {
      throw new Error("Invalid cursor");
    }

    const cursorFilter =
      cursorData && cursorDate
        ? {
            $or: [
              { createdAt: { $lt: cursorDate } },
              {
                createdAt: cursorDate,
                _id: { $lt: new Types.ObjectId(cursorData.id) },
              },
            ],
          }
        : {};

    const [payments, programs, meetings, reviews, plans] = await Promise.all([
      PaymentModel.find({
        sellerId: id,
        resourceType: "nutritionist_plan",
        status: "paid",
        ...cursorFilter,
      })
        .select("_id userId itemSnapshot createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean(),

      UserProgramModel.find({
        nutritionistId: id,
        ...cursorFilter,
      })
        .select("_id userId planId createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean(),

      MeetingModel.find({
        nutritionistId: id,
        isDeleted: false,
        ...cursorFilter,
      })
        .select("_id userId title createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean(),

      Review.find({
        nutritionist: id,
        isDeleted: false,
        ...cursorFilter,
      })
        .select("_id user rating review createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean(),

      NutritionistPlanModel.find({
        nutritionistId: id,
        status: "published",
        isDeleted: false,
        ...cursorFilter,
      })
        .select("_id title slug createdAt")
        .sort({ createdAt: -1, _id: -1 })
        .limit(pageSize + 1)
        .lean(),
    ]);

    type Activity = INutriDashboardRecentActivityItemProjection & {
      cursorId: string;
    };

    const activities: Activity[] = [
      ...payments.map((payment) => ({
        id: payment._id.toString(),
        cursorId: payment._id.toString(),
        type: "plan_purchase" as const,
        title: "Plan Purchased",
        description: `${payment.itemSnapshot.title} was purchased`,
        createdAt: payment.createdAt,
        actor: { id: payment.userId.toString(), name: "" },
      })),

      ...programs.map((program) => ({
        id: program._id.toString(),
        cursorId: program._id.toString(),
        type: "program_joined" as const,
        title: "Program Joined",
        description: "A client joined a nutrition program",
        createdAt: program.createdAt,
        actor: { id: program.userId.toString(), name: "" },
      })),

      ...meetings.map((meeting) => ({
        id: meeting._id.toString(),
        cursorId: meeting._id.toString(),
        type: "meeting_booked" as const,
        title: "Meeting Booked",
        description: meeting.title,
        createdAt: meeting.createdAt,
        actor: { id: meeting.userId.toString(), name: "" },
      })),

      ...reviews.map((review) => ({
        id: review._id.toString(),
        cursorId: review._id.toString(),
        type: "review_received" as const,
        title: "Review Received",
        description: `A client left a ${review.rating}-star review${
          review.review ? `: ${review.review}` : ""
        }`,
        createdAt: review.createdAt,
        actor: { id: review.user.toString(), name: "" },
      })),

      ...plans.map((plan) => ({
        id: plan._id.toString(),
        cursorId: plan._id.toString(),
        type: "plan_published" as const,
        title: "Plan Published",
        description: plan.title,
        createdAt: plan.createdAt,
        resource: {
          id: plan._id.toString(),
          name: plan.title,
          href: `/nutritionist/plans/${plan.slug}`,
        },
      })),
    ];

    activities.sort((a, b) => {
      const dateDifference = b.createdAt.getTime() - a.createdAt.getTime();

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return b.cursorId.localeCompare(a.cursorId);
    });

    const hasMore = activities.length > pageSize;
    const page = activities.slice(0, pageSize);
    const actorIds = [
      ...new Set(
        page.flatMap((activity) => (activity.actor ? [activity.actor.id] : [])),
      ),
    ];

    const users = await UserModel.find({
      _id: { $in: actorIds.map((actorId) => new Types.ObjectId(actorId)) },
      deletedAt: null,
    })
      .select("_id fullName profileImage")
      .lean();

    const usersById = new Map(
      users.map((user) => [
        user._id.toString(),
        {
          name: user.fullName,
          avatar: user.profileImage,
        },
      ]),
    );

    const items: INutriDashboardRecentActivityItemProjection[] = page.map(
      ({ cursorId: _cursorId, ...activity }) => {
        if (!activity.actor) {
          return activity;
        }

        const user = usersById.get(activity.actor.id);

        return {
          ...activity,
          actor: {
            id: activity.actor.id,
            name: user?.name ?? "Deleted user",
            ...(user?.avatar ? { avatar: user.avatar } : {}),
          },
        };
      },
    );

    const lastActivity = page.at(-1);

    return {
      items,
      nextCursor:
        hasMore && lastActivity
          ? encodeCursor({
              value: lastActivity.createdAt.toISOString(),
              id: lastActivity.cursorId,
            })
          : null,
      hasMore,
    };
  }
}
