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

    if (category) matchStage.category = category;
    if (difficulty) matchStage.difficulty = difficulty;
    if (accessType) matchStage.accessType = accessType;
    if (status) matchStage.status = status;

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      matchStage.$or = [
        { title: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const isAscending = sortBy === "oldest";
    const sortDirection = isAscending ? 1 : -1;

    if (cursorData) {
      const cursorValue = new Date(cursorData.value);
      const cursorId = new Types.ObjectId(cursorData.id);
      const comparisonOperator = isAscending ? "$gt" : "$lt";

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
                [comparisonOperator]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push(
      {
        $sort: {
          [sortField]: sortDirection,
          _id: sortDirection,
        },
      },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          title: 1,

          thumbnailUrl: 1,
          category: 1,
          difficulty: 1,
          accessType: 1,
          durationDays: 1,
          status: 1,
          cursorId: "$_id",
          cursorValue: `$${sortField}`,
        },
      },
    );

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

    const cleanItems: AdminChallengeListItem[] = items.map(
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
          id: { $toString: "$_id" },
          title: 1,
          description: 1,
          instructions: 1,
          thumbnailUrl: 1,
          category: 1,
          difficulty: 1,
          accessType: 1,
          durationDays: 1,
          status: 1,
        },
      },
    ]);

    return result[0] ?? null;
  }
}
