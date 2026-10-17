import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { ISession, SessionModel } from "../../../models/session.model";
import { IPublicSessionRepository } from "../../interfaces/public/IPublicSessionRepository";
import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";
import {
  IPublicSessionListItemProjection,
  IPublicSessionListProjectionWithCursor,
} from "../../../types/public/session/public-session-list-item.projection";
import { IPublicSessionDetailsProjection } from "../../../types/public/session/public-session-details.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

@injectable()
export class PublicSessionRepository
  extends BaseRepository<ISession>
  implements IPublicSessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IPublicSessionListItemProjection>> {
    const { cursor, search, type, pricingType, sortBy = "all" } = query;

    const limit = Number(query.limit ?? 12);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new Error("Invalid session limit");
    }

    const now = new Date();

    const sortConfig = {
      all: {
        field: "scheduledAt",
        direction: 1,
        upcomingFirst: true,
      },
      latest: {
        field: "createdAt",
        direction: -1,
        upcomingFirst: false,
      },
      oldest: {
        field: "createdAt",
        direction: 1,
        upcomingFirst: false,
      },
      upcoming: {
        field: "scheduledAt",
        direction: 1,
        upcomingFirst: false,
      },
      price_low_to_high: {
        field: "pricing.amount",
        direction: 1,
        upcomingFirst: false,
      },
      price_high_to_low: {
        field: "pricing.amount",
        direction: -1,
        upcomingFirst: false,
      },
    } as const;

    const {
      field: sortField,
      direction: sortDirection,
      upcomingFirst,
    } = sortConfig[sortBy];

    const cursorSortKey = `${sortBy}:${sortField}:${sortDirection}`;
    const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

    const matchConditions: Record<string, unknown>[] = [
      { status: { $in: ["scheduled", "live"] } },
    ];

    if (sortBy === "upcoming") {
      matchConditions.push({ scheduledAt: { $gte: now } });
    }

    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      const escapedSearch = normalizedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      );

      matchConditions.push({
        $or: [
          { title: { $regex: escapedSearch, $options: "i" } },
          { description: { $regex: escapedSearch, $options: "i" } },
        ],
      });
    }

    if (type) {
      matchConditions.push({ type });
    }

    if (pricingType) {
      matchConditions.push({ "pricing.type": pricingType });
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (
        cursorData.sortKey !== cursorSortKey ||
        !Types.ObjectId.isValid(cursorData.id)
      ) {
        throw new Error("Invalid cursor");
      }

      let cursorValue: Date | number;

      if (sortField === "createdAt" || sortField === "scheduledAt") {
        if (
          typeof cursorData.value !== "string" ||
          Number.isNaN(Date.parse(cursorData.value))
        ) {
          throw new Error("Invalid cursor");
        }

        cursorValue = new Date(cursorData.value);
      } else {
        if (
          typeof cursorData.value !== "number" ||
          !Number.isFinite(cursorData.value)
        ) {
          throw new Error("Invalid cursor");
        }

        cursorValue = cursorData.value;
      }

      const cursorId = new Types.ObjectId(cursorData.id);

      if (upcomingFirst) {
        const cursorIsUpcoming =
          cursorValue instanceof Date && cursorValue >= now;

        const upcomingCondition = {
          scheduledAt: { $gte: now },
        };

        const pastCondition = {
          scheduledAt: { $lt: now },
        };

        const cursorGroupCondition = cursorIsUpcoming
          ? upcomingCondition
          : pastCondition;

        matchConditions.push({
          $or: [
            {
              ...cursorGroupCondition,
              $or: [
                {
                  [sortField]: {
                    [comparisonOperator]: cursorValue,
                  },
                },
                {
                  [sortField]: cursorValue,
                  _id: {
                    [comparisonOperator]: cursorId,
                  },
                },
              ],
            },
            ...(cursorIsUpcoming ? [pastCondition] : []),
          ],
        });
      } else {
        matchConditions.push({
          $or: [
            {
              [sortField]: {
                [comparisonOperator]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [comparisonOperator]: cursorId,
              },
            },
          ],
        });
      }
    }

    const sortStage: Record<string, 1 | -1> = upcomingFirst
      ? {
          isPastSession: 1,
          scheduledAt: 1,
          _id: 1,
        }
      : {
          [sortField]: sortDirection,
          _id: sortDirection,
        };

    const pipeline: PipelineStage[] = [
      {
        $match: {
          $and: matchConditions,
        },
      },
      ...(upcomingFirst
        ? [
            {
              $addFields: {
                isPastSession: {
                  $cond: [{ $lt: ["$scheduledAt", now] }, 1, 0],
                },
              },
            } as PipelineStage,
          ]
        : []),
      {
        $sort: sortStage,
      },
      {
        $limit: limit + 1,
      },
      {
        $lookup: {
          from: "users",
          localField: "nutritionistId",
          foreignField: "_id",
          as: "nutritionist",
        },
      },
      {
        $unwind: "$nutritionist",
      },
      {
        $project: {
          _id: 0,
          item: {
            sessionId: { $toString: "$_id" },
            title: "$title",
            description: "$description",
            type: "$type",
            pricing: "$pricing",
            scheduledAt: "$scheduledAt",
            durationInMinutes: "$durationInMinutes",
            maxParticipants: "$maxParticipants",
            thumbnailUrl: "$thumbnailUrl",
            status: "$status",
            nutritionist: {
              nutritionistId: { $toString: "$nutritionist._id" },
              name: "$nutritionist.fullName",
              profileImage: "$nutritionist.profileImage",
            },
          },
          cursorId: { $toString: "$_id" },
          cursorValue: `$${sortField}`,
          ...(upcomingFirst
            ? {
                cursorIsUpcoming: {
                  $gte: ["$scheduledAt", now],
                },
              }
            : {}),
        },
      },
    ];

    const result =
      await this._model.aggregate<IPublicSessionListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const page = hasMore ? result.slice(0, limit) : result;
    const lastItem = page.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId,
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : lastItem.cursorValue,
            sortKey: cursorSortKey,
          })
        : null;

    return {
      items: page.map(({ item }) => item),
      nextCursor,
      hasMore,
    };
  }

  async findPublicSessionDetails(
    sessionId: string | Types.ObjectId,
  ): Promise<IPublicSessionDetailsProjection | null> {
    if (typeof sessionId === "string" && !Types.ObjectId.isValid(sessionId)) {
      return null;
    }

    const sessionObjectId =
      typeof sessionId === "string" ? new Types.ObjectId(sessionId) : sessionId;

    const result = await this._model.aggregate<IPublicSessionDetailsProjection>(
      [
        {
          $match: {
            _id: sessionObjectId,
            status: { $in: ["scheduled", "live"] },
          },
        },
        {
          $lookup: {
            from: "users",
            let: { nutritionistId: "$nutritionistId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$nutritionistId"] },
                },
              },
              {
                $project: {
                  _id: 1,
                  fullName: 1,
                  profileImage: 1,
                  bio: 1,
                },
              },
            ],
            as: "nutritionist",
          },
        },
        {
          $unwind: "$nutritionist",
        },
        {
          $project: {
            _id: 0,
            sessionId: { $toString: "$_id" },
            title: 1,
            description: 1,
            type: 1,
            pricing: 1,
            scheduledAt: 1,
            durationInMinutes: 1,
            maxParticipants: 1,
            thumbnailUrl: 1,
            status: 1,
            nutritionist: {
              nutritionistId: { $toString: "$nutritionist._id" },
              name: "$nutritionist.fullName",
              profileImage: "$nutritionist.profileImage",
              bio: "$nutritionist.bio",
            },
          },
        },
        { $limit: 1 },
      ],
    );

    return result[0] ?? null;
  }

  async updateSessionStatus(
    sessionId: Types.ObjectId,
    currentStatus: ISession["status"],
    nextStatus: ISession["status"],
  ): Promise<boolean> {
    const updatedCount = await this.updateOne(
      {
        _id: sessionId,
        status: currentStatus,
      },
      {
        $set: {
          status: nextStatus,
        },
      },
    );

    return updatedCount > 0;
  }
}
