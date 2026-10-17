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
import { SessionRegistrationModel } from "../../../models/sessionRegistration.model";

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
      sortBy = "latest",
      cursor,
      limit = 10,
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const sortConfig = {
      latest: { field: "createdAt", direction: -1 },
      oldest: { field: "createdAt", direction: 1 },
      date_asc: { field: "scheduledAt", direction: 1 },
      date_desc: { field: "scheduledAt", direction: -1 },
    } as const;

    const { field: sortField, direction } = sortConfig[sortBy];

    const match: Record<string, unknown> = {
      nutritionistId: nutritionistObjectId,
    };

    if (status) {
      match.status = status;
    }

    if (type) {
      match.type = type;
    }

    const searchTerm = search?.trim();

    if (searchTerm) {
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      match.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const pipeline: PipelineStage[] = [{ $match: match }];

    const cursorData = cursor ? decodeCursor(cursor) : null;

    if (cursorData) {
      const cursorObjectId = new Types.ObjectId(cursorData.id);
      const cursorValue =
        sortField === "createdAt" || sortField === "scheduledAt"
          ? new Date(cursorData.value)
          : cursorData.value;

      if (cursorValue instanceof Date && Number.isNaN(cursorValue.getTime())) {
        throw new Error("Invalid cursor");
      }

      const comparison = direction === -1 ? "$lt" : "$gt";

      pipeline.push({
        $match: {
          $or: [
            { [sortField]: { [comparison]: cursorValue } },
            {
              [sortField]: cursorValue,
              _id: { [comparison]: cursorObjectId },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: direction,
          _id: direction,
        },
      },
      { $limit: limit + 1 },
      {
        $lookup: {
          from: SessionRegistrationModel.collection.name,
          let: { sessionId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$sessionId", "$$sessionId"] },
                status: "registered",
                $or: [
                  { paymentStatus: "not_required" },
                  { paymentStatus: "paid" },
                ],
              },
            },
            { $count: "count" },
          ],
          as: "registrationStats",
        },
      },
      {
        $project: {
          _id: 0,
          sessionId: "$_id",
          title: 1,
          type: 1,
          pricing: 1,
          scheduledAt: 1,
          durationInMinutes: 1,
          thumbnailUrl: 1,
          status: 1,
          createdAt: 1,
          registeredCount: {
            $ifNull: [{ $arrayElemAt: ["$registrationStats.count", 0] }, 0],
          },
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

    const result =
      await this._model.aggregate<INutriSessionListProjectionWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;
    const items = hasMore ? result.slice(0, limit) : result;
    const lastItem = items.at(-1);

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue,
          })
        : null;

    return {
      items: items.map(
        ({ cursorId: _cursorId, cursorValue: _cursorValue, ...session }) =>
          session,
      ),
      nextCursor,
      hasMore,
    };
  }

  async findSessionDetails(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
  ): Promise<INutriSessionDetailsProjection | null> {
    const session = await this._model
      .findOne({ _id: sessionId, nutritionistId })
      .select({
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
      })
      .lean()
      .exec();

    if (!session) {
      return null;
    }

    return {
      sessionId: session._id,
      title: session.title,
      description: session.description,
      type: session.type,
      pricing: session.pricing,
      scheduledAt: session.scheduledAt,
      durationInMinutes: session.durationInMinutes,
      maxParticipants: session.maxParticipants,
      roomId: session.roomId,
      thumbnailUrl: session.thumbnailUrl,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
