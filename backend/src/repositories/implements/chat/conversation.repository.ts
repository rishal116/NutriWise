import { ClientSession, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { CursorData } from "../../../types/cursor.types";

import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";

import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";

import { ConversationMemberModel } from "../../../models/conversationMember.model";

import { encodeCursor } from "../../../utils/cursor.util";

export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }

  private toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  async findByDirectKey(
    directKey: string,
    session?: ClientSession,
  ): Promise<IConversation | null> {
    return this._model
      .findOne({
        directKey,
        chatType: "direct",
        status: "active",
      })
      .session(session ?? null)
      .lean<IConversation | null>()
      .exec();
  }

  async findUserConversations(
    userId: string,
    limit: number,
    cursor?: CursorData,
  ): Promise<CursorPaginationResult<IConversation>> {
    const userObjectId = this.toObjectId(userId);

    const match: Record<string, unknown> = {
      status: {
        $ne: "closed",
      },
    };

    if (cursor) {
      const cursorDate =
        cursor.value instanceof Date ? cursor.value : new Date(cursor.value);

      match.$or = [
        {
          lastActivityAt: {
            $lt: cursorDate,
          },
        },
        {
          lastActivityAt: cursorDate,
          _id: {
            $lt: this.toObjectId(cursor.id),
          },
        },
      ];
    }

    const conversations = await this._model
      .aggregate<IConversation>([
        {
          $lookup: {
            from: ConversationMemberModel.collection.name,
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
                        $eq: ["$userId", userObjectId],
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
            as: "membership",
          },
        },

        {
          $match: {
            ...match,
            "membership.0": {
              $exists: true,
            },
          },
        },

        {
          $sort: {
            lastActivityAt: -1,
            _id: -1,
          },
        },

        {
          $limit: limit + 1,
        },
      ])
      .exec();

    const hasMore = conversations.length > limit;

    const items = hasMore ? conversations.slice(0, limit) : conversations;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem?.lastActivityAt
        ? encodeCursor({
            value: lastItem.lastActivityAt,
            id: lastItem._id.toString(),
            sortKey: "lastActivityAt",
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findActiveConversation(
    conversationId: string,
  ): Promise<IConversation | null> {
    return this._model
      .findOne({
        _id: this.toObjectId(conversationId),
        status: "active",
      })
      .lean<IConversation | null>()
      .exec();
  }

  async findGroups(limit: number, skip: number): Promise<IConversation[]> {
    return this._model
      .find({
        chatType: "group",
        status: {
          $ne: "closed",
        },
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean<IConversation[]>()
      .exec();
  }

  async countGroups(): Promise<number> {
    return this._model.countDocuments({
      chatType: "group",
      status: {
        $ne: "closed",
      },
    });
  }
}
