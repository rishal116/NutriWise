import { ClientSession, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IConversationMemberRepository } from "../../interfaces/chat/IConversationMemberRepository";

import {
  ConversationMemberModel,
  IConversationMember,
} from "../../../models/conversationMember.model";

export class ConversationMemberRepository
  extends BaseRepository<IConversationMember>
  implements IConversationMemberRepository
{
  constructor() {
    super(ConversationMemberModel);
  }

  private toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  async createManyWithSession(
    data: Partial<IConversationMember>[],
    session: ClientSession,
  ): Promise<IConversationMember[]> {
    const docs = await this._model.insertMany(data, {
      session,
    });

    return docs.map((doc) => doc.toObject() as IConversationMember);
  }

  async createMany(
    data: Partial<IConversationMember>[],
  ): Promise<IConversationMember[]> {
    const docs = await this._model.insertMany(data);

    return docs.map((doc) => doc.toObject() as IConversationMember);
  }

  async findByConversationId(
    conversationId: string,
  ): Promise<IConversationMember[]> {
    return this._model
      .find({
        conversationId: this.toObjectId(conversationId),
        status: "active",
      })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findByConversationIds(
    conversationIds: string[],
  ): Promise<IConversationMember[]> {
    return this._model
      .find({
        conversationId: {
          $in: conversationIds.map((id) => this.toObjectId(id)),
        },
        status: "active",
      })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findByUser(userId: string): Promise<IConversationMember[]> {
    return this._model
      .find({
        userId: this.toObjectId(userId),
        status: "active",
      })
      .sort({
        updatedAt: -1,
      })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findMember(
    conversationId: string,
    userId: string,
  ): Promise<IConversationMember | null> {
    return this._model
      .findOne({
        conversationId: this.toObjectId(conversationId),
        userId: this.toObjectId(userId),
        status: "active",
      })
      .lean<IConversationMember | null>()
      .exec();
  }

  async existsMember(conversationId: string, userId: string): Promise<boolean> {
    const member = await this._model.exists({
      conversationId: this.toObjectId(conversationId),
      userId: this.toObjectId(userId),
      status: "active",
    });

    return member !== null;
  }

  async addMembers(
    conversationId: string,
    members: {
      userId: string;
      role?: "member" | "admin" | "owner";
    }[],
  ): Promise<void> {
    const docs = members.map((member) => ({
      conversationId: this.toObjectId(conversationId),
      userId: this.toObjectId(member.userId),
      role: member.role ?? "member",
      status: "active",
      joinedAt: new Date(),
    }));

    await this._model.insertMany(docs, {
      ordered: false,
    });
  }

  async leaveConversation(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await this._model.updateOne(
      {
        conversationId: this.toObjectId(conversationId),
        userId: this.toObjectId(userId),
        status: "active",
      },
      {
        $set: {
          status: "left",
          leftAt: new Date(),
        },
      },
    );
  }

  async incrementUnread(
    conversationId: string,
    senderId: string,
  ): Promise<void> {
    await this._model.updateMany(
      {
        conversationId: this.toObjectId(conversationId),
        userId: {
          $ne: this.toObjectId(senderId),
        },
        status: "active",
      },
      {
        $inc: {
          unreadCount: 1,
        },
      },
    );
  }

  async resetUnread(conversationId: string, userId: string): Promise<void> {
    await this._model.updateOne(
      {
        conversationId: this.toObjectId(conversationId),
        userId: this.toObjectId(userId),
        status: "active",
      },
      {
        $set: {
          unreadCount: 0,
          lastReadAt: new Date(),
        },
      },
    );
  }
}
