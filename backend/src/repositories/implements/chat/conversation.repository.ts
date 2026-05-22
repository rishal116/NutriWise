import { BaseRepository } from "../common/base.repository";
import {
  IConversationRepository,
  ConversationCursor,
} from "../../interfaces/chat/IConversationRepository";
import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";
import { Types } from "mongoose";
import { ConversationMemberModel } from "../../../models/conversationMember.model";

type GroupCursorQuery = {
  createdAt?: { $lt: Date };
};

export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository {
  constructor() {
    super(ConversationModel);
  }

  async findByDirectKey(
    key: string,
  ): Promise<IConversation | null> {
    return this._model
      .findOne({
        directKey: key,
        isDeleted: false,
      })
      .lean<IConversation>()
      .exec();
  }

  async findUserConversations(
    userId: string,
    limit: number,
    cursor?: ConversationCursor,
  ): Promise<IConversation[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const memberships = await ConversationMemberModel.find({
      userId: new Types.ObjectId(userId),
      status: "active",
    })
      .select({ conversationId: 1 })
      .lean<{ conversationId: Types.ObjectId }[]>()
      .exec();

    const conversationIds = memberships.map(
      (membership) => membership.conversationId,
    );

    if (!conversationIds.length) return [];

    type ConversationQuery = {
      _id: {
        $in: Types.ObjectId[];
      };
      isDeleted: false;
      $or?: (
        | {
          lastMessageAt: {
            $lt: Date;
          };
        }
        | {
          lastMessageAt: Date;
          _id: {
            $lt: Types.ObjectId;
          };
        }
      )[];
    };

    const query: ConversationQuery = {
      _id: { $in: conversationIds },
      isDeleted: false,
    };

    if (cursor) {
      query.$or = [
        {
          lastMessageAt: {
            $lt: new Date(cursor.lastMessageAt),
          },
        },
        {
          lastMessageAt: new Date(cursor.lastMessageAt),
          _id: {
            $lt: new Types.ObjectId(cursor.id),
          },
        },
      ];
    }

    return this._model
      .find(query)
      .sort({
        lastMessageAt: -1,
        _id: -1,
      })
      .limit(safeLimit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async findUserConversationsPaginated(
    conversationIds: string[],
    limit: number,
    cursor?: ConversationCursor,
  ): Promise<IConversation[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    type PaginatedConversationQuery = {
      _id: {
        $in: Types.ObjectId[];
      };
      isDeleted: false;
      $or?: (
        | {
          lastMessageAt: {
            $lt: Date;
          };
        }
        | {
          lastMessageAt: Date;
          _id: {
            $lt: Types.ObjectId;
          };
        }
      )[];
    };

    const query: PaginatedConversationQuery = {
      _id: {
        $in: conversationIds.map(
          (id) => new Types.ObjectId(id),
        ),
      },
      isDeleted: false,
    };

    if (cursor) {
      query.$or = [
        {
          lastMessageAt: {
            $lt: new Date(cursor.lastMessageAt),
          },
        },
        {
          lastMessageAt: new Date(cursor.lastMessageAt),
          _id: {
            $lt: new Types.ObjectId(cursor.id),
          },
        },
      ];
    }

    return this._model
      .find(query)
      .sort({
        lastMessageAt: -1,
        _id: -1,
      })
      .limit(safeLimit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async findGroups(
    limit: number,
    cursor?: string,
  ): Promise<IConversation[]> {
    const safeLimit = Math.min(Math.max(limit, 1), 50);

    const query: {
      chatType: "group";
      isDeleted: false;
    } & GroupCursorQuery = {
      chatType: "group",
      isDeleted: false,
    };

    if (cursor) {
      query.createdAt = {
        $lt: new Date(cursor),
      };
    }

    return this._model
      .find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(safeLimit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async countGroups(): Promise<number> {
    return this._model.countDocuments({
      chatType: "group",
      isDeleted: false,
    });
  }

  async incrementMemberCount(
    groupId: string,
    value: number,
  ): Promise<void> {
    await this._model.updateOne(
      {
        _id: new Types.ObjectId(groupId),
      },
      {
        $inc: {
          memberCount: value,
        },
      },
    );
  }
}