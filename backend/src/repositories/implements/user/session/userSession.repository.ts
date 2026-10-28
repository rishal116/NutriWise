import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import type { UserSessionListQueryDTO } from "../../../../dtos/user/session/user-session-list-query.dto";
import {
  SessionRegistrationModel,
  type ISessionRegistration,
} from "../../../../models/sessionRegistration.model";
import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../../types/user/session/user-session.projection";
import type { UserSessionSortBy } from "../../../../types/user/session/user-session.types";
import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";
import { BaseRepository } from "../../common/base.repository";
import type { IUserSessionRepository } from "../../../interfaces/user/session/IUserSessionRepository";

type SessionSortField =
  | "session.scheduledAt"
  | "registeredAt"
  | "session.title";

interface IUserSessionAggregateRow extends IUserSessionListProjection {
  _id: Types.ObjectId;
  cursorValue: Date | string;
  cursorId: Types.ObjectId;
}

@injectable()
export class UserSessionRepository
  extends BaseRepository<ISessionRegistration>
  implements IUserSessionRepository
{
  constructor() {
    super(SessionRegistrationModel);
  }

  async findUserSessions(
    userId: string | Types.ObjectId,
    query: UserSessionListQueryDTO,
  ): Promise<CursorPaginationResult<IUserSessionListProjection>> {
    const userObjectId = this.toObjectId(userId);
    const limit = query.limit ?? 10;
    const sortBy = this.getSortBy(query.sortBy);
    const sortConfig = this.getSortConfig(sortBy);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
        },
      },
      {
        $lookup: {
          from: "hosted_sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      {
        $unwind: "$session",
      },
    ];

    if (query.search?.trim()) {
      const escapedSearch = query.search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          "session.title": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      });
    }

    if (query.registrationStatus) {
      pipeline.push({
        $match: {
          status: query.registrationStatus,
        },
      });
    }

    if (query.paymentStatus) {
      pipeline.push({
        $match: {
          paymentStatus: query.paymentStatus,
        },
      });
    }

    if (query.sessionType) {
      pipeline.push({
        $match: {
          "session.type": query.sessionType,
        },
      });
    }

    if (query.sessionStatus) {
      pipeline.push({
        $match: {
          "session.status": query.sessionStatus,
        },
      });
    }

    const decodedCursor = decodeCursor(query.cursor);

    const validCursor =
      decodedCursor &&
      decodedCursor.sortKey === sortBy &&
      Types.ObjectId.isValid(decodedCursor.id) &&
      (sortConfig.field === "session.title"
        ? typeof decodedCursor.value === "string"
        : !Number.isNaN(new Date(decodedCursor.value).getTime()))
        ? decodedCursor
        : null;

    if (validCursor) {
      const cursorValue =
        sortConfig.field === "session.title"
          ? validCursor.value
          : new Date(validCursor.value);

      const comparisonOperator = sortConfig.direction === 1 ? "$gt" : "$lt";

      pipeline.push({
        $match: {
          $or: [
            {
              [sortConfig.field]: {
                [comparisonOperator]: cursorValue,
              },
            },
            {
              [sortConfig.field]: cursorValue,
              _id: {
                [comparisonOperator]: new Types.ObjectId(validCursor.id),
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortConfig.field]: sortConfig.direction,
          _id: sortConfig.direction,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 1,
          registrationId: "$_id",
          sessionId: 1,
          registrationStatus: "$status",
          paymentStatus: 1,
          registeredAt: 1,
          cancelledAt: 1,
          session: {
            title: "$session.title",
            type: "$session.type",
            pricing: {
              type: "$session.pricing.type",
              amount: "$session.pricing.amount",
              currency: "$session.pricing.currency",
            },
            scheduledAt: "$session.scheduledAt",
            durationInMinutes: "$session.durationInMinutes",
            thumbnailUrl: "$session.thumbnailUrl",
            status: "$session.status",
          },
          cursorValue: `$${sortConfig.field}`,
          cursorId: "$_id",
        },
      },
    );

    const rows =
      await SessionRegistrationModel.aggregate<IUserSessionAggregateRow>(
        pipeline,
      );

    const hasMore = rows.length > limit;
    const pageRows = rows.slice(0, limit);
    const lastRow = pageRows.at(-1);

    const items: IUserSessionListProjection[] = pageRows.map(
      ({ _id, cursorValue, cursorId, ...item }) => item,
    );

    const nextCursor =
      hasMore && lastRow
        ? encodeCursor({
            id: lastRow.cursorId.toString(),
            value: lastRow.cursorValue,
            sortKey: sortBy,
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findUserSessionDetails(
    userId: string | Types.ObjectId,
    sessionId: string | Types.ObjectId,
  ): Promise<IUserSessionDetailsProjection | null> {
    const userObjectId = this.toObjectId(userId);
    const sessionObjectId = this.toObjectId(sessionId);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          sessionId: sessionObjectId,
        },
      },
      {
        $lookup: {
          from: "hosted_sessions",
          localField: "sessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      {
        $unwind: "$session",
      },
      {
        $project: {
          _id: 0,
          registrationId: "$_id",
          sessionId: 1,
          registrationStatus: "$status",
          paymentStatus: 1,
          registeredAt: 1,
          cancelledAt: 1,
          attendedAt: 1,
          session: {
            nutritionistId: "$session.nutritionistId",
            title: "$session.title",
            description: "$session.description",
            type: "$session.type",
            pricing: {
              type: "$session.pricing.type",
              amount: "$session.pricing.amount",
              currency: "$session.pricing.currency",
            },
            scheduledAt: "$session.scheduledAt",
            durationInMinutes: "$session.durationInMinutes",
            maxParticipants: "$session.maxParticipants",
            roomId: "$session.roomId",
            thumbnailUrl: "$session.thumbnailUrl",
            status: "$session.status",
          },
        },
      },
      {
        $limit: 1,
      },
    ];

    const [result] =
      await SessionRegistrationModel.aggregate<IUserSessionDetailsProjection>(
        pipeline,
      );

    return result ?? null;
  }

  private toObjectId(value: string | Types.ObjectId): Types.ObjectId {
    if (value instanceof Types.ObjectId) {
      return value;
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid ObjectId");
    }

    return new Types.ObjectId(value);
  }

  private getSortBy(sortBy?: UserSessionSortBy): UserSessionSortBy {
    return sortBy ?? "upcoming";
  }

  private getSortConfig(sortBy: UserSessionSortBy): {
    field: SessionSortField;
    direction: 1 | -1;
  } {
    switch (sortBy) {
      case "latest":
        return {
          field: "registeredAt",
          direction: -1,
        };

      case "oldest":
        return {
          field: "registeredAt",
          direction: 1,
        };

      case "title_asc":
        return {
          field: "session.title",
          direction: 1,
        };

      case "title_desc":
        return {
          field: "session.title",
          direction: -1,
        };

      case "upcoming":
      default:
        return {
          field: "session.scheduledAt",
          direction: 1,
        };
    }
  }
}
