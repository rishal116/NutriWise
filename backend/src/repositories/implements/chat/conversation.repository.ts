import { ClientSession, PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";
import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";
import { ConversationMemberModel } from "../../../models/conversationMember.model";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import {
  IConversationDetails,
  IConversationListItem,
} from "../../../types/chat/conversation.types";
import { UserModel } from "../../../models/user.model";
import { ConversationListFilter } from "../../../types/chat/conversation-list.types";
import { MessageModel } from "../../../models/message.model";

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
    cursor?: string,
    filter: ConversationListFilter = "all",
    search?: string,
  ): Promise<CursorPaginationResult<IConversationListItem>> {
    const userObjectId = this.toObjectId(userId);
    const decodedCursor = decodeCursor(cursor);
    const trimmedSearch = search?.trim();

    const memberMatch: Record<string, unknown> = {
      userId: userObjectId,
      status: "active",
    };

    const conversationMatch: Record<string, unknown> = {
      "conversation.status": {
        $ne: "closed",
      },
    };

    if (filter === "personal") {
      conversationMatch["conversation.chatType"] = "direct";
    } else if (filter === "group") {
      conversationMatch["conversation.chatType"] = "group";
    }

    if (decodedCursor) {
      const cursorDate =
        decodedCursor.value instanceof Date
          ? decodedCursor.value
          : new Date(decodedCursor.value);

      conversationMatch.$or = [
        {
          "conversation.lastActivityAt": {
            $lt: cursorDate,
          },
        },
        {
          "conversation.lastActivityAt": cursorDate,
          "conversation._id": {
            $lt: this.toObjectId(decodedCursor.id),
          },
        },
      ];
    }

    const pipeline: PipelineStage[] = [
      {
        $match: memberMatch,
      },
      {
        $lookup: {
          from: this._model.collection.name,
          localField: "conversationId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                chatType: 1,
                title: 1,
                groupAvatar: 1,
                lastMessagePreview: 1,
                lastMessageSenderId: 1,
                lastActivityAt: 1,
                status: 1,
              },
            },
          ],
          as: "conversation",
        },
      },
      {
        $unwind: "$conversation",
      },
      {
        $match: conversationMatch,
      },

      {
        $lookup: {
          from: MessageModel.collection.name,
          let: {
            conversationId: "$conversation._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$conversationId", "$$conversationId"],
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
                _id: 1,
                text: 1,
                deletedAt: 1,
              },
            },
          ],
          as: "latestMessage",
        },
      },
    ];

    if (filter !== "group") {
      pipeline.push(
        {
          $lookup: {
            from: ConversationMemberModel.collection.name,
            let: {
              conversationId: "$conversationId",
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
                      {
                        $ne: ["$userId", userObjectId],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  userId: 1,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "otherMember",
          },
        },
        {
          $lookup: {
            from: UserModel.collection.name,
            let: {
              otherUserId: {
                $arrayElemAt: ["$otherMember.userId", 0],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$otherUserId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  fullName: 1,
                  profileImage: 1,
                },
              },
              {
                $limit: 1,
              },
            ],
            as: "otherUser",
          },
        },
      );
    }

    if (trimmedSearch) {
      const searchRegex = new RegExp(
        trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );

      if (filter === "personal") {
        pipeline.push({
          $match: {
            "otherUser.fullName": searchRegex,
          },
        });
      } else if (filter === "group") {
        pipeline.push({
          $match: {
            "conversation.title": searchRegex,
          },
        });
      } else {
        pipeline.push({
          $match: {
            $or: [
              {
                "conversation.chatType": "direct",
                "otherUser.fullName": searchRegex,
              },
              {
                "conversation.chatType": "group",
                "conversation.title": searchRegex,
              },
            ],
          },
        });
      }
    }

    pipeline.push(
      {
        $sort: {
          "conversation.lastActivityAt": -1,
          "conversation._id": -1,
        },
      },
      {
        $limit: limit + 1,
      },
      {
        $project: {
          _id: 0,
          conversationId: "$conversation._id",
          chatType: "$conversation.chatType",
          title: "$conversation.title",
          groupAvatar: "$conversation.groupAvatar",

          otherUserId: {
            $cond: [
              {
                $eq: ["$conversation.chatType", "direct"],
              },
              {
                $arrayElemAt: ["$otherUser._id", 0],
              },
              null,
            ],
          },

          otherUsername: {
            $cond: [
              {
                $eq: ["$conversation.chatType", "direct"],
              },
              {
                $arrayElemAt: ["$otherUser.fullName", 0],
              },
              null,
            ],
          },

          otherProfileImage: {
            $cond: [
              {
                $eq: ["$conversation.chatType", "direct"],
              },
              {
                $arrayElemAt: ["$otherUser.profileImage", 0],
              },
              null,
            ],
          },

          lastMessagePreview: {
            $cond: [
              {
                $ne: [
                  {
                    $ifNull: [
                      { $arrayElemAt: ["$latestMessage.deletedAt", 0] },
                      null,
                    ],
                  },
                  null,
                ],
              },
              "This message was deleted",
              "$conversation.lastMessagePreview",
            ],
          },

          lastMessageSenderId: "$conversation.lastMessageSenderId",

          lastActivityAt: "$conversation.lastActivityAt",

          unreadCount: {
            $ifNull: ["$unreadCount", 0],
          },

          isMuted: {
            $ifNull: ["$isMuted", false],
          },

          isArchived: {
            $ifNull: ["$isArchived", false],
          },
        },
      },
    );

    const conversations =
      await ConversationMemberModel.aggregate<IConversationListItem>(
        pipeline,
      ).exec();

    const hasMore = conversations.length > limit;

    const items = hasMore ? conversations.slice(0, limit) : conversations;

    const lastItem = items[items.length - 1];

    const nextCursor =
      hasMore && lastItem?.lastActivityAt
        ? encodeCursor({
            value: lastItem.lastActivityAt,
            id: lastItem.conversationId.toString(),
            sortKey: "lastActivityAt",
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async findUserConversationDetails(
    userId: string,
    conversationId: string,
  ): Promise<IConversationDetails | null> {
    const userObjectId = this.toObjectId(userId);
    const conversationObjectId = this.toObjectId(conversationId);

    const [result] =
      await ConversationMemberModel.aggregate<IConversationDetails>([
        {
          $match: {
            conversationId: conversationObjectId,
            userId: userObjectId,
            status: "active",
          },
        },
        {
          $lookup: {
            from: "conversations",
            let: {
              conversationId: "$conversationId",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$_id", "$$conversationId"],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  chatType: 1,
                  purpose: 1,
                  status: 1,
                  title: 1,
                  groupAvatar: 1,
                  description: 1,
                  lastMessagePreview: 1,
                  lastActivityAt: 1,
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            ],
            as: "conversation",
          },
        },
        {
          $unwind: "$conversation",
        },
        {
          $lookup: {
            from: "conversationmembers",
            let: {
              conversationId: "$conversationId",
              chatType: "$conversation.chatType",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$$chatType", "direct"] },
                      { $eq: ["$conversationId", "$$conversationId"] },
                      { $eq: ["$status", "active"] },
                      { $ne: ["$userId", userObjectId] },
                    ],
                  },
                },
              },
              {
                $limit: 1,
              },
              {
                $lookup: {
                  from: "users",
                  let: {
                    userId: "$userId",
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ["$_id", "$$userId"],
                        },
                      },
                    },
                    {
                      $project: {
                        _id: 1,
                        fullName: 1,
                        profileImage: 1,
                      },
                    },
                  ],
                  as: "user",
                },
              },
              {
                $unwind: "$user",
              },
              {
                $project: {
                  userId: "$user._id",
                  fullName: "$user.fullName",
                  profileImage: "$user.profileImage",
                },
              },
            ],
            as: "participant",
          },
        },
        {
          $project: {
            conversationId: "$conversation._id",
            chatType: "$conversation.chatType",
            purpose: "$conversation.purpose",
            status: "$conversation.status",
            title: "$conversation.title",
            groupAvatar: "$conversation.groupAvatar",
            description: "$conversation.description",
            participant: {
              $arrayElemAt: ["$participant", 0],
            },
            lastMessagePreview: "$conversation.lastMessagePreview",
            lastActivityAt: "$conversation.lastActivityAt",
            unreadCount: {
              $ifNull: ["$unreadCount", 0],
            },
            isMuted: {
              $ifNull: ["$isMuted", false],
            },
            isArchived: {
              $ifNull: ["$isArchived", false],
            },
            createdAt: "$conversation.createdAt",
            updatedAt: "$conversation.updatedAt",
          },
        },
      ]);

    return result ?? null;
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

  async countGroups(): Promise<number> {
    return this._model.countDocuments({
      chatType: "group",
      status: {
        $ne: "closed",
      },
    });
  }

  async findPrivateGroupByInviteTokenHash(
    inviteTokenHash: string,
  ): Promise<IConversation | null> {
    return this._model
      .findOne({
        inviteTokenHash,
        chatType: "group",
        visibility: "private",
        purpose: "group_coaching",
        status: "active",
      })
      .select("+inviteTokenHash")
      .lean<IConversation | null>()
      .exec();
  }

  async updatePrivateGroupInviteToken(
    conversationId: string,
    inviteToken: string,
    inviteTokenHash: string,
  ): Promise<boolean> {
    const result = await this._model
      .updateOne(
        {
          _id: this.toObjectId(conversationId),
          chatType: "group",
          visibility: "private",
          purpose: "group_coaching",
          status: "active",
        },
        {
          $set: {
            inviteToken,
            inviteTokenHash,
          },
        },
      )
      .exec();

    return result.matchedCount > 0;
  }
}
