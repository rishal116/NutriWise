import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";
import {
  ISessionRegistration,
  SessionRegistrationModel,
} from "../../../models/sessionRegistration.model";
import { SessionModel } from "../../../models/session.model";
import { UserModel } from "../../../models/user.model";
import { BaseRepository } from "../common/base.repository";
import { INutriSessionRegistrationRepository } from "../../interfaces/nutritionist/INutriSessionRegistrationRepository";
import { INutriSessionParticipantProjection } from "../../../types/nutritionist/session/nutri-session-participant.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-participants-query.dto";

interface ParticipantAggregationResult extends INutriSessionParticipantProjection {
  cursorId: Types.ObjectId;
  cursorValue: Date;
}

@injectable()
export class NutriSessionRegistrationRepository
  extends BaseRepository<ISessionRegistration>
  implements INutriSessionRegistrationRepository
{
  constructor() {
    super(SessionRegistrationModel);
  }

  async findSessionParticipants(
    sessionId: string | Types.ObjectId,
    nutritionistId: string | Types.ObjectId,
    query: NutriSessionParticipantsQueryDTO,
  ): Promise<CursorPaginationResult<INutriSessionParticipantProjection>> {
    const { search, status, paymentStatus, cursor, limit = 10 } = query;

    const sessionObjectId =
      typeof sessionId === "string" ? new Types.ObjectId(sessionId) : sessionId;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const sessionExists = await SessionModel.exists({
      _id: sessionObjectId,
      nutritionistId: nutritionistObjectId,
    });

    if (!sessionExists) {
      return {
        items: [],
        nextCursor: null,
        hasMore: false,
      };
    }

    const matchStage: Record<string, unknown> = {
      sessionId: sessionObjectId,
      status: status ?? { $ne: "cancelled" },
    };

    if (paymentStatus) {
      matchStage.paymentStatus = paymentStatus;
    }

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
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
          "user.isBlocked": false,
        },
      },
    ];

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          "user.fullName": {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      });
    }

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (!decodedCursor) {
        throw new Error("Invalid participant pagination cursor");
      }

      const cursorDate = new Date(decodedCursor.value);
      const cursorId = new Types.ObjectId(decodedCursor.id);

      pipeline.push({
        $match: {
          $or: [
            {
              registeredAt: {
                $lt: cursorDate,
              },
            },
            {
              registeredAt: cursorDate,
              _id: {
                $lt: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          registeredAt: -1,
          _id: -1,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,
          registrationId: "$_id",
          userId: 1,
          fullName: "$user.fullName",
          username: "$user.username",
          profileImage: "$user.profileImage",
          status: 1,
          paymentStatus: 1,
          registeredAt: 1,
          cursorId: "$_id",
          cursorValue: "$registeredAt",
        },
      },
    );

    const results =
      await SessionRegistrationModel.aggregate<ParticipantAggregationResult>(
        pipeline,
      );

    const hasMore = results.length > limit;
    const pageResults = results.slice(0, limit);
    const lastItem = pageResults[pageResults.length - 1];

    const items: INutriSessionParticipantProjection[] = pageResults.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...participant }) =>
        participant,
    );

    return {
      items,
      nextCursor:
        hasMore && lastItem
          ? encodeCursor({
              value: lastItem.cursorValue.toISOString(),
              id: lastItem.cursorId.toString(),
            })
          : null,
      hasMore,
    };
  }
}
