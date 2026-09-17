import { injectable } from "inversify";
import { PipelineStage, Types } from "mongoose";

import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";

import { IPublicGroupRepository } from "../../interfaces/public/IPublicGroupRepository";

import { BaseRepository } from "../common/base.repository";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { PublicGroupListItem } from "../../../types/public/group/public-group-list-item.type";
import { PublicGroupListQuery } from "../../../types/public/group/public-group-list-query.type";

const PUBLIC_GROUP_SORT_FIELD_MAP = {
  newest: "createdAt",
  oldest: "createdAt",
  title_asc: "title",
  title_desc: "title",
} as const;

type PublicGroupWithCursor = PublicGroupListItem & {
  cursorId: Types.ObjectId;
  cursorValue: string | Date;
};

@injectable()
export class PublicGroupRepository
  extends BaseRepository<IConversation>
  implements IPublicGroupRepository
{
  constructor() {
    super(ConversationModel);
  }

  async findGroups(
    query: PublicGroupListQuery,
  ): Promise<CursorPaginationResult<PublicGroupListItem>> {
    const { search, sortBy = "newest", cursor, limit = 12 } = query;

    const cursorData = decodeCursor(cursor);

    if (cursorData?.sortKey && cursorData.sortKey !== sortBy) {
      throw new Error("Invalid cursor");
    }

    const sortField = PUBLIC_GROUP_SORT_FIELD_MAP[sortBy];
    const isAscending = sortBy === "oldest" || sortBy === "title_asc";

    const pipeline: PipelineStage[] = [];

    const baseMatch: Record<string, unknown> = {
      chatType: "group",
      purpose: "group_coaching",
      visibility: "public",
      status: "active",
    };

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      baseMatch.$or = [
        {
          title: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapedSearch,
            $options: "i",
          },
        },
      ];
    }

    pipeline.push({
      $match: baseMatch,
    });

    if (cursorData) {
      const cursorValue =
        sortField === "createdAt"
          ? new Date(cursorData.value)
          : String(cursorData.value);

      const cursorId = new Types.ObjectId(cursorData.id);

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
                [isAscending ? "$gt" : "$lt"]: cursorId,
              },
            },
          ],
        },
      });
    }

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
      $lookup: {
        from: "conversationmembers",
        let: {
          conversationId: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$conversationId", "$$conversationId"],
                  },
                  {
                    $eq: ["$status", "active"],
                  },
                ],
              },
            },
          },
          {
            $count: "count",
          },
        ],
        as: "memberStats",
      },
    });

    pipeline.push({
      $project: {
        _id: 0,
        id: {
          $toString: "$_id",
        },
        title: 1,
        description: 1,
        groupAvatar: 1,
        visibility: 1,
        status: 1,
        memberCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$memberStats.count", 0],
            },
            0,
          ],
        },
        createdAt: 1,
        updatedAt: 1,
        cursorId: "$_id",
        cursorValue: `$${sortField}`,
      },
    });

    const result = await this._model.aggregate<PublicGroupWithCursor>(pipeline);

    const hasMore = result.length > limit;

    const items = hasMore ? result.slice(0, limit) : result;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem
        ? encodeCursor({
            id: lastItem.cursorId.toString(),
            value:
              lastItem.cursorValue instanceof Date
                ? lastItem.cursorValue.toISOString()
                : String(lastItem.cursorValue),
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

  async findGroupById(groupId: string): Promise<IConversation | null> {
    if (!Types.ObjectId.isValid(groupId)) {
      return null;
    }

    return this._model
      .findOne({
        _id: groupId,
        chatType: "group",
        purpose: "group_coaching",
        visibility: "public",
        status: "active",
      })
      .lean<IConversation | null>()
      .exec();
  }
}
