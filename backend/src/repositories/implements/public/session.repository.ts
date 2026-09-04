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

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: {
            $in: ["scheduled", "live"],
          },
        },
      },
    ];

    if (search?.trim()) {
      const searchTerm = search.trim();

      pipeline.push({
        $match: {
          $or: [
            {
              title: {
                $regex: searchTerm,
                $options: "i",
              },
            },
            {
              description: {
                $regex: searchTerm,
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

    let sortStage: Record<string, 1 | -1>;

    switch (sortBy) {
      case "latest":
        sortStage = {
          createdAt: -1,
          _id: -1,
        };
        break;

      case "oldest":
        sortStage = {
          createdAt: 1,
          _id: 1,
        };
        break;

      case "price_low_to_high":
        sortStage = {
          "pricing.amount": 1,
          _id: 1,
        };
        break;

      case "price_high_to_low":
        sortStage = {
          "pricing.amount": -1,
          _id: -1,
        };
        break;

      case "upcoming":
      default:
        sortStage = {
          scheduledAt: 1,
          _id: 1,
        };

        pipeline.push({
          $match: {
            scheduledAt: {
              $gte: now,
            },
          },
        });

        break;
    }

    const sortField = Object.keys(sortStage)[0];
    const sortDirection = sortStage[sortField];

    const cursorData = cursor ? decodeCursor(cursor) : null;

    const cursorSortKey = `${sortBy}:${sortDirection}`;

    if (cursorData?.sortKey && cursorData.sortKey !== cursorSortKey) {
      throw new Error("Invalid cursor");
    }

    if (cursorData) {
      let cursorValue: string | number | Date = cursorData.value;

      if (sortField === "createdAt" || sortField === "scheduledAt") {
        cursorValue = new Date(cursorData.value);
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

          cursorValue:
            sortField === "pricing.amount"
              ? "$pricing.amount"
              : sortField === "scheduledAt"
                ? "$scheduledAt"
                : "$createdAt",
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

      let cursorValue = lastItem.cursorValue;

      if (cursorValue instanceof Date) {
        cursorValue = cursorValue.toISOString();
      }

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
