import { injectable } from "inversify";

import { PipelineStage, Types } from "mongoose";

import { ChallengeModel, IChallenge } from "../../../models/challenge.model";

import { IAdminChallengeRepository } from "../../interfaces/admin/IAdminChallengeRepository";

import { BaseRepository } from "../common/base.repository";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";

import { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";
import { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

const ADMIN_CHALLENGE_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
  start_date_asc: "startDate",
  start_date_desc: "startDate",
} as const;

type ChallengeCardWithCursor = AdminChallengeListItem & {
  cursorId: Types.ObjectId;
  cursorValue: Date;
};

@injectable()
export class AdminChallengeRepository
  extends BaseRepository<IChallenge>
  implements IAdminChallengeRepository
{
  constructor() {
    super(ChallengeModel);
  }

  async findChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<CursorPaginationResult<AdminChallengeListItem>> {
    const {
      search,
      category,
      difficulty,
      type,
      accessType,
      status,
      sortBy = "newest",
      cursor,
      limit = 12,
    } = query;

    const sortField = ADMIN_CHALLENGE_SORT_FIELD_MAP[sortBy];

    const cursorData = decodeCursor(cursor);

    const pipeline: PipelineStage[] = [];

    const matchStage: Record<string, unknown> = {};

    if (category) {
      matchStage.category = category;
    }

    if (difficulty) {
      matchStage.difficulty = difficulty;
    }

    if (type) {
      matchStage.type = type;
    }

    if (accessType) {
      matchStage.accessType = accessType;
    }

    if (status) {
      matchStage.status = status;
    }

    if (search?.trim()) {
      matchStage.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({
        $match: matchStage,
      });
    }

    if (cursorData) {
      const cursorValue = new Date(cursorData.value);

      const isAscending = sortBy === "oldest" || sortBy === "start_date_asc";

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

    const isAscending = sortBy === "oldest" || sortBy === "start_date_asc";

    pipeline.push({
      $sort: {
        [sortField]: isAscending ? 1 : -1,
        _id: isAscending ? 1 : -1,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    pipeline.push({
      $project: {
        _id: 0,

        id: {
          $toString: "$_id",
        },

        title: 1,
        description: 1,
        thumbnailUrl: 1,

        category: 1,
        difficulty: 1,
        type: 1,
        accessType: 1,

        durationDays: 1,

        startDate: 1,
        endDate: 1,

        status: 1,

        rewardPoints: {
          $ifNull: ["$rewardPoints", 0],
        },

        createdAt: 1,
        updatedAt: 1,

        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result =
      await this._model.aggregate<ChallengeCardWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value: lastItem.cursorValue.toISOString(),
            sortKey: sortBy,
          })
        : null;

    const cleanItems = items.map(
      ({ cursorId: _cursorId, cursorValue: _cursorValue, ...item }) => item,
    );

    return {
      items: cleanItems,
      nextCursor,
      hasMore,
    };
  }

  async findChallengeById(
    challengeId: string,
  ): Promise<AdminChallengeDetailsResult | null> {
    const result = await this._model.aggregate<AdminChallengeDetailsResult>([
      {
        $match: {
          _id: new Types.ObjectId(challengeId),
        },
      },
      {
        $project: {
          _id: 0,

          id: {
            $toString: "$_id",
          },

          title: 1,
          description: 1,
          instructions: 1,
          thumbnailUrl: 1,

          category: 1,
          difficulty: 1,
          type: 1,
          accessType: 1,
          valueType: 1,

          durationDays: 1,

          targetValue: 1,
          targetUnit: 1,
          targetCount: 1,

          startDate: 1,
          endDate: 1,

          rewardPoints: {
            $ifNull: ["$rewardPoints", 0],
          },

          badgeId: {
            $cond: [
              {
                $ne: ["$badgeId", null],
              },
              {
                $toString: "$badgeId",
              },
              null,
            ],
          },

          status: 1,

          createdBy: {
            $toString: "$createdBy",
          },

          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    if (!result.length) {
      return null;
    }

    return result[0];
  }
}
