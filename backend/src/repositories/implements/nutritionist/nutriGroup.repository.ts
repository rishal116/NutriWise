import { injectable } from "inversify";
import { ClientSession, PipelineStage, Types } from "mongoose";

import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";

import { ConversationMemberModel } from "../../../models/conversationMember.model";

import { BaseRepository } from "../../implements/common/base.repository";

import { INutriGroupRepository } from "../../interfaces/nutritionist/INutriGroupRepository";

import { encodeCursor, decodeCursor } from "../../../utils/cursor.util";

import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import type { CreateNutritionistGroupData } from "../../../types/nutritionist/group/create-nutritionist-group.type";

import type { NutritionistGroupDetailsResult } from "../../../types/nutritionist/group/nutritionist-group-details-result.type";

import type { NutritionistGroupListItem } from "../../../types/nutritionist/group/nutritionist-group-list-item.type";

import type {
  NutritionistGroupListQuery,
  NutritionistGroupSortBy,
} from "../../../types/nutritionist/group/nutritionist-group-list-query.type";

const NUTRI_GROUP_SORT_FIELD_MAP: Record<
  NutritionistGroupSortBy,
  {
    field: string;
    order: 1 | -1;
  }
> = {
  newest: {
    field: "conversation.createdAt",
    order: -1,
  },

  oldest: {
    field: "conversation.createdAt",
    order: 1,
  },

  title_asc: {
    field: "conversation.title",
    order: 1,
  },

  title_desc: {
    field: "conversation.title",
    order: -1,
  },
};

interface NutritionistGroupCardWithCursor extends NutritionistGroupListItem {
  cursorId: Types.ObjectId;
  cursorValue: string | Date;
}

interface NutritionistGroupDetailsWithToken extends Omit<
  NutritionistGroupDetailsResult,
  "inviteToken"
> {
  inviteTokenEncrypted?: string;
}

@injectable()
export class NutriGroupRepository
  extends BaseRepository<IConversation>
  implements INutriGroupRepository
{
  constructor() {
    super(ConversationModel);
  }

  async createGroup(
    nutritionistId: string | Types.ObjectId,
    data: CreateNutritionistGroupData,
    session: ClientSession,
  ): Promise<IConversation> {
    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const [conversation] = await this._model.create(
      [
        {
          chatType: "group",
          visibility: data.visibility,
          purpose: "group_coaching",
          status: "active",
          title: data.title,
          description: data.description,
          groupAvatar: data.groupAvatar,
          inviteTokenEncrypted: data.inviteTokenEncrypted,
        },
      ],
      {
        session,
      },
    );

    await ConversationMemberModel.create(
      [
        {
          conversationId: conversation._id,
          userId: nutritionistObjectId,
          role: "owner",
          status: "active",
        },
      ],
      {
        session,
      },
    );

    return conversation;
  }

  async findGroups(
    nutritionistId: string | Types.ObjectId,
    query: NutritionistGroupListQuery,
  ): Promise<CursorPaginationResult<NutritionistGroupListItem>> {
    const {
      cursor,
      limit = 12,
      search,
      status,
      visibility,
      sortBy = "newest",
    } = query;

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const decodedCursor = decodeCursor(cursor);

    const { field, order } = NUTRI_GROUP_SORT_FIELD_MAP[sortBy];

    if (decodedCursor?.sortKey && decodedCursor.sortKey !== sortBy) {
      throw new Error("Invalid cursor");
    }

    const pipeline: PipelineStage[] = [
      {
        $match: {
          userId: nutritionistObjectId,
          role: "owner",
          status: "active",
        },
      },

      {
        $lookup: {
          from: ConversationModel.collection.name,
          localField: "conversationId",
          foreignField: "_id",
          as: "conversation",
        },
      },

      {
        $unwind: "$conversation",
      },

      {
        $match: {
          "conversation.chatType": "group",
          "conversation.purpose": "group_coaching",
        },
      },
    ];

    if (search?.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      pipeline.push({
        $match: {
          $or: [
            {
              "conversation.title": {
                $regex: escapedSearch,
                $options: "i",
              },
            },
            {
              "conversation.description": {
                $regex: escapedSearch,
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
          "conversation.status": status,
        },
      });
    }

    if (visibility) {
      pipeline.push({
        $match: {
          "conversation.visibility": visibility,
        },
      });
    }

    if (decodedCursor) {
      const isAscending = order === 1;

      const cursorValue = decodedCursor.value;
      const cursorId = new Types.ObjectId(decodedCursor.id);

      pipeline.push({
        $match: {
          $or: [
            {
              [field]: {
                [isAscending ? "$gt" : "$lt"]: cursorValue,
              },
            },
            {
              [field]: cursorValue,
              "conversation._id": {
                [isAscending ? "$gt" : "$lt"]: cursorId,
              },
            },
          ],
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: ConversationMemberModel.collection.name,
        let: {
          groupId: "$conversation._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$conversationId", "$$groupId"],
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
          $toString: "$conversation._id",
        },

        title: "$conversation.title",

        description: "$conversation.description",

        groupAvatar: "$conversation.groupAvatar",

        visibility: "$conversation.visibility",

        status: "$conversation.status",

        memberCount: {
          $ifNull: [
            {
              $arrayElemAt: ["$memberStats.count", 0],
            },
            0,
          ],
        },

        createdAt: "$conversation.createdAt",

        updatedAt: "$conversation.updatedAt",

        cursorId: "$conversation._id",

        cursorValue:
          sortBy === "title_asc" || sortBy === "title_desc"
            ? "$conversation.title"
            : "$conversation.createdAt",
      },
    });

    pipeline.push({
      $sort: {
        [field]: order,
        "conversation._id": order,
      },
    });

    pipeline.push({
      $limit: limit + 1,
    });

    const result =
      await ConversationMemberModel.aggregate<NutritionistGroupCardWithCursor>(
        pipeline,
      );

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
                : lastItem.cursorValue,
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

  async findGroupDetails(
    nutritionistId: string | Types.ObjectId,
    groupId: string | Types.ObjectId,
  ): Promise<NutritionistGroupDetailsResult | null> {
    if (!Types.ObjectId.isValid(groupId)) {
      return null;
    }

    const nutritionistObjectId =
      typeof nutritionistId === "string"
        ? new Types.ObjectId(nutritionistId)
        : nutritionistId;

    const groupObjectId =
      typeof groupId === "string" ? new Types.ObjectId(groupId) : groupId;

    const result =
      await this._model.aggregate<NutritionistGroupDetailsWithToken>([
        {
          $match: {
            _id: groupObjectId,
            chatType: "group",
            purpose: "group_coaching",
          },
        },

        {
          $lookup: {
            from: ConversationMemberModel.collection.name,
            let: {
              groupId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$conversationId", "$$groupId"],
                      },
                      {
                        $eq: ["$userId", nutritionistObjectId],
                      },
                      {
                        $eq: ["$role", "owner"],
                      },
                      {
                        $eq: ["$status", "active"],
                      },
                    ],
                  },
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "ownerMembership",
          },
        },

        {
          $match: {
            "ownerMembership.0": {
              $exists: true,
            },
          },
        },

        {
          $lookup: {
            from: ConversationMemberModel.collection.name,
            let: {
              groupId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ["$conversationId", "$$groupId"],
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
        },

        {
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

            inviteTokenEncrypted: 1,

            createdAt: 1,

            updatedAt: 1,
          },
        },
      ]);

    return result[0] ?? null;
  }
}
