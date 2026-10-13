import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { ISession, SessionModel } from "../../../models/session.model";

import { ISessionRepository } from "../../interfaces/public/ISessionRepository";

import { PublicSessionListQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";

import {
  IPublicSessionListItemProjection,
  IPublicSessionListProjectionWithCursor,
} from "../../../types/public/session/public-session-list-item.projection";

import { IPublicSessionDetailsProjection } from "../../../types/public/session/public-session-details.projection";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

@injectable()
export class SessionRepository
  extends BaseRepository<ISession>
  implements ISessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findPublicSessions(
    query: PublicSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IPublicSessionListItemProjection>> {
    const {
      limit = 12,
      cursor,
      search,
      type,
      pricingType,
      sortBy = "upcoming",
    } = query;

    const now = new Date();

    const sortConfig = {
      latest: {
        field: "createdAt",
        direction: -1,
      },
      oldest: {
        field: "createdAt",
        direction: 1,
      },
      upcoming: {
        field: "scheduledAt",
        direction: 1,
      },
      price_low_to_high: {
        field: "pricing.amount",
        direction: 1,
      },
      price_high_to_low: {
        field: "pricing.amount",
        direction: -1,
      },
    } as const;

    const { field: sortField, direction: sortDirection } = sortConfig[sortBy];

    const sortStage: Record<string, 1 | -1> = {
      [sortField]: sortDirection,
      _id: sortDirection,
    };

    const cursorSortKey = `${sortBy}:${sortField}:${sortDirection}`;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: {
            $in: ["scheduled", "live"],
          },
        },
      },
    ];

    if (sortBy === "upcoming") {
      pipeline.push({
        $match: {
          scheduledAt: {
            $gte: now,
          },
        },
      });
    }

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              description: {
                $regex: escapedSearch,
                $options: "i",
              },
            },
          ],
        },
      });
    }

    if (type) {
      pipeline.push({
        $match: {
          type,
        },
      });
    }

    if (pricingType) {
      pipeline.push({
        $match: {
          "pricing.type": pricingType,
        },
      });
    }

    const cursorData = decodeCursor(cursor);

    if (cursorData) {
      if (
        cursorData.sortKey !== cursorSortKey ||
        !Types.ObjectId.isValid(cursorData.id)
      ) {
        throw new Error("Invalid cursor");
      }

      let cursorValue: Date | number | string = cursorData.value;

      if (sortField === "createdAt" || sortField === "scheduledAt") {
        if (
          typeof cursorData.value !== "string" ||
          Number.isNaN(Date.parse(cursorData.value))
        ) {
          throw new Error("Invalid cursor");
        }

        cursorValue = new Date(cursorData.value);
      } else if (typeof cursorData.value !== "number") {
        throw new Error("Invalid cursor");
      }

      const comparisonOperator = sortDirection === -1 ? "$lt" : "$gt";

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [comparisonOperator]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [comparisonOperator]: new Types.ObjectId(cursorData.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push(
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

          sessionId: {
            $toString: "$_id",
          },

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
            nutritionistId: {
              $toString: "$nutritionist._id",
            },
            name: "$nutritionist.fullName",
            profileImage: "$nutritionist.profileImage",
          },

          cursorId: {
            $toString: "$_id",
          },

          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<IPublicSessionListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      const cursorValue =
        lastItem.cursorValue instanceof Date
          ? lastItem.cursorValue.toISOString()
          : lastItem.cursorValue;

      nextCursor = encodeCursor({
        id: lastItem.cursorId,
        value: cursorValue,
        sortKey: cursorSortKey,
      });
    }

    const sessionItems: IPublicSessionListItemProjection[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...session }) =>
        session,
    );

    return {
      items: sessionItems,
      nextCursor,
      hasMore,
    };
  }

  async findPublicSessionDetails(
    sessionId: string | Types.ObjectId,
  ): Promise<IPublicSessionDetailsProjection | null> {
    const sessionObjectId =
      typeof sessionId === "string" ? new Types.ObjectId(sessionId) : sessionId;

    const result = await this._model.aggregate([
      {
        $match: {
          _id: sessionObjectId,
          status: {
            $in: ["scheduled", "live"],
          },
        },
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
          _id: 1,
          title: 1,
          description: 1,
          type: 1,
          pricing: 1,
          scheduledAt: 1,
          durationInMinutes: 1,
          maxParticipants: 1,
          thumbnailUrl: 1,
          status: 1,
          createdAt: 1,

          nutritionist: {
            nutritionistId: {
              $toString: "$nutritionist._id",
            },
            name: "$nutritionist.fullName",
            profileImage: "$nutritionist.profileImage",
            bio: "$nutritionist.bio",
          },
        },
      },
    ]);

    const session = result[0];

    if (!session) {
      return null;
    }

    return {
      sessionId: session._id.toString(),
      title: session.title,
      description: session.description,
      type: session.type,

      pricing: {
        type: session.pricing.type,
        amount: session.pricing.amount,
        currency: session.pricing.currency,
      },

      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      maxParticipants: session.maxParticipants,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,

      nutritionist: {
        nutritionistId: session.nutritionist.nutritionistId,
        name: session.nutritionist.name,
        profileImage: session.nutritionist.profileImage,
        bio: session.nutritionist.bio,
      },

      createdAt: session.createdAt,
    };
  }
}
