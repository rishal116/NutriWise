import { BaseRepository } from "../common/base.repository";
import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";
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
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }

  async findByDirectKey(key: string): Promise<IConversation | null> {
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
    cursor?: string,
  ): Promise<IConversation[]> {
    const memberships = await ConversationMemberModel.find({
      userId: new Types.ObjectId(userId),
    })
      .select({ conversationId: 1 })
      .lean<{ conversationId: Types.ObjectId }[]>()
      .exec();

    const conversationIds = memberships.map(
      (m) => new Types.ObjectId(m.conversationId),
    );

    if (conversationIds.length === 0) return [];

    const query: {
      _id: { $in: Types.ObjectId[] };
      isDeleted: false;
      lastMessageAt?: { $lt: Date };
    } = {
      _id: { $in: conversationIds },
      isDeleted: false,
    };

    if (cursor) {
      query.lastMessageAt = { $lt: new Date(cursor) };
    }

    return this._model
      .find(query)
      .sort({ lastMessageAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async findUserConversationsPaginated(
    conversationIds: string[],
    limit: number,
    cursor?: string,
  ): Promise<IConversation[]> {
    const query: {
      _id: { $in: Types.ObjectId[] };
      isDeleted: false;
      lastMessageAt?: { $lt: Date };
    } = {
      _id: {
        $in: conversationIds.map((id) => new Types.ObjectId(id)),
      },
      isDeleted: false,
    };

    if (cursor) {
      query.lastMessageAt = { $lt: new Date(cursor) };
    }

    return this._model
      .find(query)
      .sort({ lastMessageAt: -1 })
      .limit(limit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async findGroups(limit: number, cursor?: string): Promise<IConversation[]> {
    const query: {
      chatType: "group";
      isDeleted: false;
    } & GroupCursorQuery = {
      chatType: "group",
      isDeleted: false,
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    return this._model
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean<IConversation[]>()
      .exec();
  }

  async countGroups(): Promise<number> {
    return this._model.countDocuments({
      chatType: "group",
      isDeleted: false,
    });
  }

  async addJoinRequest(
    groupId: string,
    request: { userId: string; requestedAt: Date },
  ) {
    return this._model.updateOne(
      {
        _id: new Types.ObjectId(groupId),
        chatType: "group",
        isDeleted: false,
      },
      {
        $addToSet: {
          joinRequests: {
            userId: new Types.ObjectId(request.userId),
            requestedAt: request.requestedAt,
          },
        },
      },
    );
  }

  async incrementMemberCount(groupId: string, value: number): Promise<void> {
    await this._model.updateOne(
      { _id: new Types.ObjectId(groupId) },
      { $inc: { memberCount: value } },
    );
  }
}
