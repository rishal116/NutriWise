import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import { ISession, SessionModel } from "../../../models/session.model";
import { BaseRepository } from "../../implements/common/base.repository";
import { INutriSessionRepository } from "../../interfaces/nutritionist/INutriSessionRepository";
import { GetNutriSessionsQueryDTO } from "../../../dtos/nutritionist/session/session-list-query.dto";
import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  INutriSessionListProjection,
  INutriSessionListProjectionWithCursor,
} from "../../../types/nutritionist/session/nutri-session-list.projection";
import { INutriSessionDetailsProjection } from "../../../types/nutritionist/session/nutri-session-details.projection";

@injectable()
export class NutriSessionRepository
  extends BaseRepository<ISession>
  implements INutriSessionRepository
{
  constructor() {
    super(SessionModel);
  }

  async findSessions(
    nutritionistId: string | Types.ObjectId,
    query: GetNutriSessionsQueryDTO,
  ): Promise<CursorPaginationResult<INutriSessionListProjection>> {
    const {
      search,
      status,
      type,
      pricingType,
      sortBy = "latest",
      cursor,
      limit = 10,
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const cursorData = cursor ? decodeCursor(cursor) : null;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          nutritionistId: nutritionistObjectId,
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

    if (status) {
      pipeline.push({
        $match: {
          status,
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
      case "oldest":
        sortStage = {
          createdAt: 1,
          _id: 1,
        };
        break;

      case "title_asc":
        sortStage = {
          title: 1,
          _id: 1,
        };
        break;

      case "title_desc":
        sortStage = {
          title: -1,
          _id: -1,
        };
        break;

      case "date_asc":
        sortStage = {
          scheduledAt: 1,
          _id: 1,
        };
        break;

      case "date_desc":
        sortStage = {
          scheduledAt: -1,
          _id: -1,
        };
        break;

      case "latest":
      default:
        sortStage = {
          createdAt: -1,
          _id: -1,
        };
        break;
    }

    const sortField = Object.keys(sortStage)[0];
    const sortDirection = sortStage[sortField];

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

    pipeline.push({
      $sort: sortStage,
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,
        sessionId: "$_id",
        title: 1,
        type: 1,
        pricing: 1,
        scheduledAt: 1,
        durationInMinutes: 1,
        maxParticipants: 1,
        thumbnailUrl: 1,
        status: 1,
        registeredCount: 1,
        createdAt: 1,
        cursorId: "$_id",
        cursorValue:
          sortField === "title"
            ? "$title"
            : sortField === "scheduledAt"
              ? "$scheduledAt"
              : "$createdAt",
      },
    });

    const result =
      await this._model.aggregate<INutriSessionListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    let nextCursor: string | null = null;

    if (hasMore && items.length > 0) {
      const lastItem = items[items.length - 1];

      nextCursor = encodeCursor({
        id: lastItem.cursorId.toString(),
        value: lastItem.cursorValue,
      });
    }

    const sessionItems: INutriSessionListProjection[] = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...session }) =>
        session,
    );

    return {
      items: sessionItems,
      nextCursor,
      hasMore,
    };
  }

  async findSessionDetails(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriSessionDetailsProjection | null> {
    const sessionObjectId =
      typeof sessionId === "string" ? new Types.ObjectId(sessionId) : sessionId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const result = await this._model.aggregate<INutriSessionDetailsProjection>([
      {
        $match: {
          _id: sessionObjectId,
          nutritionistId: nutritionistObjectId,
        },
      },
      {
        $project: {
          _id: 0,

          sessionId: "$_id",

          title: 1,
          description: 1,
          type: 1,
          pricing: 1,
          scheduledAt: 1,
          durationInMinutes: 1,
          maxParticipants: 1,
          roomId: 1,
          thumbnailUrl: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }
}
