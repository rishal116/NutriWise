import { injectable } from "inversify";
import { Types } from "mongoose";
import type { PipelineStage } from "mongoose";

import type { UserSessionListQueryDTO } from "../../../../dtos/user/session/user-session-list-query.dto";

import {
  SessionRegistrationModel,
  type ISessionRegistration,
} from "../../../../models/sessionRegistration.model";
import { SessionModel } from "../../../../models/session.model";

import type { CursorPaginationResult } from "../../../../types/common/cursor-pagination.types";
import type {
  IUserSessionDetailsProjection,
  IUserSessionListProjection,
} from "../../../../types/user/session/user-session.projection";
import type { UserSessionSortBy } from "../../../../types/user/session/user-session.types";

import { decodeCursor, encodeCursor } from "../../../../utils/cursor.util";
import { toObjectId } from "../../../../utils/object-id.util";

import type { IUserSessionRepository } from "../../../interfaces/user/session/IUserSessionRepository";
import { BaseRepository } from "../../common/base.repository";

type SessionSortField =
  | "session.scheduledAt"
  | "registeredAt"
  | "session.title";

type SessionCursorValue = string | Date;

interface IUserSessionAggregateRow extends IUserSessionListProjection {
  _id: Types.ObjectId;
  cursorValue: SessionCursorValue;
  cursorId: Types.ObjectId;
}

interface IUserSessionSortConfig {
  field: SessionSortField;
  direction: 1 | -1;
  valueType: "date" | "string";
}

interface IUserSessionCursor {
  id: string;
  value: SessionCursorValue;
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
    const userObjectId = toObjectId(userId, "User ID");
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? "upcoming";
    const sortConfig = this.getSortConfig(sortBy);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
        },
      },
      ...this.getSessionLookupStages(),
      {
        $match: {
          "session.deletedAt": null,
        },
      },
    ];

    this.addSearchFilter(pipeline, query.search);
    this.addRegistrationStatusFilter(pipeline, query.registrationStatus);
    this.addSessionStatusFilter(pipeline, query.sessionStatus);

    const cursor = this.getValidCursor(query.cursor, sortBy, sortConfig);

    if (cursor) {
      pipeline.push(this.getCursorMatchStage(cursor, sortConfig));
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
      this.getListProjectionStage(sortConfig.field),
    );

    const rows =
      await SessionRegistrationModel.aggregate<IUserSessionAggregateRow>(
        pipeline,
      );

    const hasMore = rows.length > limit;
    const pageRows = rows.slice(0, limit);
    const lastRow = pageRows.at(-1);

    const items: IUserSessionListProjection[] = pageRows.map((row) => {
      const { _id, cursorValue, cursorId, ...item } = row;

      void _id;
      void cursorValue;
      void cursorId;

      return item;
    });

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
    const userObjectId = toObjectId(userId, "User ID");
    const sessionObjectId = toObjectId(sessionId, "Session ID");

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: userObjectId,
          sessionId: sessionObjectId,
        },
      },
      ...this.getSessionLookupStages(),
      {
        $match: {
          "session.deletedAt": null,
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          registrationId: "$_id",
          sessionId: 1,
          registrationStatus: "$status",
          registeredAt: 1,
          cancelledAt: 1,
          attendedAt: 1,
          session: {
            nutritionistId: "$session.nutritionistId",
            title: "$session.title",
            description: "$session.description",
            type: "$session.type",
            pricing: {
              type: "$session.pricingType",
              amount: "$session.pricing.amount",
              currency: "$session.pricing.currency",
            },
            scheduledAt: "$session.scheduledAt",
            durationInMinutes: "$session.duration",
            maxParticipants: "$session.maxParticipants",
            roomId: "$session.roomId",
            thumbnailUrl: "$session.thumbnailUrl",
            status: "$session.status",
          },
        },
      },
    ];

    const [result] =
      await SessionRegistrationModel.aggregate<IUserSessionDetailsProjection>(
        pipeline,
      );

    return result ?? null;
  }

  private getSessionLookupStages(): PipelineStage[] {
    return [
      {
        $lookup: {
          from: SessionModel.collection.name,
          localField: "sessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      {
        $unwind: "$session",
      },
    ];
  }

  private addSearchFilter(pipeline: PipelineStage[], search?: string): void {
    const normalizedSearch = search?.trim();

    if (!normalizedSearch) return;

    const escapedSearch = normalizedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

    pipeline.push({
      $match: {
        "session.title": {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    });
  }

  private addRegistrationStatusFilter(
    pipeline: PipelineStage[],
    registrationStatus?: UserSessionListQueryDTO["registrationStatus"],
  ): void {
    if (!registrationStatus) return;

    pipeline.push({
      $match: {
        status: registrationStatus,
      },
    });
  }

  private addSessionStatusFilter(
    pipeline: PipelineStage[],
    sessionStatus?: UserSessionListQueryDTO["sessionStatus"],
  ): void {
    if (!sessionStatus) return;

    pipeline.push({
      $match: {
        "session.status": sessionStatus,
      },
    });
  }

  private getValidCursor(
    cursor: string | undefined,
    sortBy: UserSessionSortBy,
    sortConfig: IUserSessionSortConfig,
  ): IUserSessionCursor | null {
    if (!cursor) return null;

    const decodedCursor = decodeCursor(cursor);

    if (
      !decodedCursor ||
      decodedCursor.sortKey !== sortBy ||
      !Types.ObjectId.isValid(decodedCursor.id)
    ) {
      return null;
    }

    if (sortConfig.valueType === "date") {
      const dateValue =
        decodedCursor.value instanceof Date
          ? decodedCursor.value
          : new Date(decodedCursor.value);

      if (Number.isNaN(dateValue.getTime())) return null;

      return {
        id: decodedCursor.id,
        value: dateValue,
      };
    }

    if (typeof decodedCursor.value !== "string") {
      return null;
    }

    return {
      id: decodedCursor.id,
      value: decodedCursor.value,
    };
  }

  private getCursorMatchStage(
    cursor: IUserSessionCursor,
    sortConfig: IUserSessionSortConfig,
  ): PipelineStage.Match {
    const comparisonOperator = sortConfig.direction === 1 ? "$gt" : "$lt";

    const cursorObjectId = new Types.ObjectId(cursor.id);

    return {
      $match: {
        $or: [
          {
            [sortConfig.field]: {
              [comparisonOperator]: cursor.value,
            },
          },
          {
            [sortConfig.field]: cursor.value,
            _id: {
              [comparisonOperator]: cursorObjectId,
            },
          },
        ],
      },
    };
  }

  private getListProjectionStage(
    sortField: SessionSortField,
  ): PipelineStage.Project {
    return {
      $project: {
        _id: 1,
        registrationId: "$_id",
        sessionId: 1,
        registrationStatus: "$status",
        registeredAt: 1,
        session: {
          title: "$session.title",
          type: "$session.type",
          pricing: {
            type: "$session.pricingType",
            amount: "$session.pricing.amount",
            currency: "$session.pricing.currency",
          },
          scheduledAt: "$session.scheduledAt",
          durationInMinutes: "$session.duration",
          thumbnailUrl: "$session.thumbnailUrl",
          status: "$session.status",
        },
        cursorValue: `$${sortField}`,
        cursorId: "$_id",
      },
    };
  }

  private getSortConfig(sortBy: UserSessionSortBy): IUserSessionSortConfig {
    switch (sortBy) {
      case "latest":
        return {
          field: "registeredAt",
          direction: -1,
          valueType: "date",
        };

      case "oldest":
        return {
          field: "registeredAt",
          direction: 1,
          valueType: "date",
        };

      case "title_asc":
        return {
          field: "session.title",
          direction: 1,
          valueType: "string",
        };

      case "title_desc":
        return {
          field: "session.title",
          direction: -1,
          valueType: "string",
        };

      case "upcoming":
      default:
        return {
          field: "session.scheduledAt",
          direction: 1,
          valueType: "date",
        };
    }
  }
}
