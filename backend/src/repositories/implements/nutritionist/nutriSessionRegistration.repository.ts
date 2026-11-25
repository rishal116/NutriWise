import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import {
  ISessionRegistration,
  SessionRegistrationModel,
} from "../../../models/sessionRegistration.model";
import { UserModel } from "../../../models/user.model";
import { PaymentModel } from "../../../models/payment.model";

import { BaseRepository } from "../common/base.repository";
import { INutriSessionRegistrationRepository } from "../../interfaces/nutritionist/INutriSessionRegistrationRepository";

import { INutriSessionParticipantProjection } from "../../../types/nutritionist/session-registration/nutri-session-participant.projection";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { CursorData } from "../../../types/cursor.types";
import { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participants-query.dto";

import { encodeCursor } from "../../../utils/cursor.util";

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
    sessionId: Types.ObjectId,
    query: NutriSessionParticipantsQueryDTO,
    cursor?: CursorData | null,
  ): Promise<CursorPaginationResult<INutriSessionParticipantProjection>> {
    const { search, status, paymentStatus, limit = 10 } = query;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          sessionId,
          status: status ?? { $ne: "cancelled" },
        },
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
      {
        $lookup: {
          from: PaymentModel.collection.name,
          let: {
            registrationId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$itemId", "$$registrationId"],
                    },
                    {
                      $eq: ["$itemType", "session_registration"],
                    },
                  ],
                },
              },
            },
            {
              $sort: {
                createdAt: -1,
                _id: -1,
              },
            },
            {
              $limit: 1,
            },
            {
              $project: {
                _id: 0,
                status: 1,
              },
            },
          ],
          as: "payment",
        },
      },
      {
        $addFields: {
          paymentStatus: {
            $ifNull: [
              {
                $arrayElemAt: ["$payment.status", 0],
              },
              null,
            ],
          },
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

    if (paymentStatus) {
      pipeline.push({
        $match: {
          paymentStatus,
        },
      });
    }

    if (cursor) {
      const cursorDate = new Date(cursor.value);

      if (
        !Types.ObjectId.isValid(cursor.id) ||
        Number.isNaN(cursorDate.getTime())
      ) {
        throw new Error("Invalid participant pagination cursor");
      }

      const cursorId = new Types.ObjectId(cursor.id);

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
      ).exec();

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
