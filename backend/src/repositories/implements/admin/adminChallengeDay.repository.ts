import { PipelineStage, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IAdminChallengeDayRepository } from "../../interfaces/admin/IAdminChallengDayRepository";

import {
  ChallengeDayModel,
  IChallengeDay,
} from "../../../models/challengeDay.model";

import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";

import { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";

import { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";

type AdminChallengeDayListItemWithCursor = AdminChallengeDayListItemDTO & {
  cursorId: Types.ObjectId;
  cursorValue: number;
};

const ADMIN_CHALLENGE_DAY_SORT_FIELD_MAP = {
  day_asc: "dayNumber",
  day_desc: "dayNumber",
} as const;

export class AdminChallengeDayRepository
  extends BaseRepository<IChallengeDay>
  implements IAdminChallengeDayRepository
{
  constructor() {
    super(ChallengeDayModel);
  }

  async findDays(
    challengeId: string,
    query: AdminChallengeDayListQueryDTO,
  ): Promise<CursorPaginationResult<AdminChallengeDayListItemDTO>> {
    const { sortBy = "day_asc", cursor, limit = 12 } = query;

    const challengeObjectId = new Types.ObjectId(challengeId);

    const cursorData = decodeCursor(cursor);

    const sortField = ADMIN_CHALLENGE_DAY_SORT_FIELD_MAP[sortBy];

    const isAscending = sortBy === "day_asc";

    const pipeline: PipelineStage[] = [
      {
        $match: {
          challengeId: challengeObjectId,
        },
      },
    ];

    if (cursorData) {
      const cursorValue = Number(cursorData.value);

      pipeline.push({
        $match: {
          $or: [
            {
              [sortField]: {
                [isAscending ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              [sortField]: cursorValue,
              _id: {
                [isAscending ? "$gt" : "$lt"]: new Types.ObjectId(
                  cursorData.id,
                ),
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: isAscending ? 1 : -1,
          _id: isAscending ? 1 : -1,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,

          id: {
            $toString: "$_id",
          },

          challengeId: {
            $toString: "$challengeId",
          },

          dayNumber: 1,
          title: 1,
          description: 1,

          activityCount: {
            $size: {
              $ifNull: ["$activities", []],
            },
          },

          createdAt: 1,
          updatedAt: 1,

          cursorId: "$_id",
          cursorValue: "$dayNumber",
        },
      },
    );

    const result =
      await this._model.aggregate<AdminChallengeDayListItemWithCursor>(
        pipeline,
      );

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue,
            sortKey: sortBy,
          })
        : null;

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...day }) => day,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findDayById(
    challengeId: string,
    dayId: string,
  ): Promise<AdminChallengeDayDetailsDTO | null> {
    if (
      !Types.ObjectId.isValid(challengeId) ||
      !Types.ObjectId.isValid(dayId)
    ) {
      return null;
    }

    const result = await this._model.aggregate<AdminChallengeDayDetailsDTO>([
      {
        $match: {
          _id: new Types.ObjectId(dayId),
          challengeId: new Types.ObjectId(challengeId),
        },
      },

      {
        $project: {
          _id: 0,

          id: {
            $toString: "$_id",
          },

          challengeId: {
            $toString: "$challengeId",
          },

          dayNumber: 1,
          title: 1,
          description: 1,
          activities: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }
}
