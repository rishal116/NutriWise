import { Types } from "mongoose";
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

  private toObjectId(id: string) {
    return new Types.ObjectId(id);
  }

  async createMany(
    data: Partial<IConversationMember>[],
  ): Promise<IConversationMember[]> {
    const docs = await this._model.insertMany(data, { ordered: false });
    return docs.map((doc) => doc.toObject());
  }

  async findByConversationId(conversationId: string) {
    return this._model
      .find({
        conversationId: this.toObjectId(conversationId),
        status: "active",
      })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findByConversationIds(conversationIds: string[]) {
    const objectIds = conversationIds.map(this.toObjectId);

    return this._model
      .find({
        conversationId: { $in: objectIds },
        status: "active",
      })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findByUser(userId: string, roleContext: "user" | "nutritionist") {
    return this._model
      .find({
        userId: this.toObjectId(userId),
        roleContext,
        status: "active",
      })
      .sort({ updatedAt: -1 })
      .lean<IConversationMember[]>()
      .exec();
  }

  async findMember(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ) {
    return this._model
      .findOne({
        conversationId: this.toObjectId(conversationId),
        userId: this.toObjectId(userId),
        roleContext,
        status: "active",
      })
      .lean<IConversationMember | null>()
      .exec();
  }

  async incrementUnread(
    conversationId: string,
    senderId: string,
    senderContext: "user" | "nutritionist",
  ) {
    await this._model
      .updateMany(
        {
          conversationId: this.toObjectId(conversationId),
          userId: { $ne: this.toObjectId(senderId) },
          roleContext: senderContext === "user" ? "nutritionist" : "user",
          status: "active",
        },
        {
          $inc: { unreadCount: 1 },
        },
      )
      .exec();
  }

  async incrementUnreadForGroup(conversationId: string, senderId: string) {
    await this._model
      .updateMany(
        {
          conversationId: this.toObjectId(conversationId),
          userId: { $ne: this.toObjectId(senderId) },
          status: "active",
        },
        {
          $inc: { unreadCount: 1 },
        },
      )
      .exec();
  }

  async resetUnread(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ) {
    await this._model
      .updateOne(
        {
          conversationId: this.toObjectId(conversationId),
          userId: this.toObjectId(userId),
          roleContext,
          status: "active",
        },
        {
          $set: {
            unreadCount: 0,
            lastReadAt: new Date(),
          },
        },
      )
      .exec();
  }

  async exists(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ) {
    const member = await this._model.exists({
      conversationId: this.toObjectId(conversationId),
      userId: this.toObjectId(userId),
      roleContext,
      status: "active",
    });

    return !!member;
  }

  async addMembers(
    conversationId: string,
    members: {
      userId: string;
      roleContext: "user" | "nutritionist";
      role?: "member" | "admin" | "owner";
    }[],
  ): Promise<void> {
    const docs = members.map((m) => ({
      conversationId: this.toObjectId(conversationId),
      userId: this.toObjectId(m.userId),
      role: m.role ?? "member",
      roleContext: m.roleContext,
      status: "active",
      joinedAt: new Date(),
    }));

    try {
      await this._model.insertMany(docs, { ordered: false });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "writeErrors" in err) {
        return;
      }
      throw err;
    }
  }

  async leaveConversation(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ) {
    await this._model
      .updateOne(
        {
          conversationId: this.toObjectId(conversationId),
          userId: this.toObjectId(userId),
          roleContext,
          status: "active",
        },
        {
          $set: {
            status: "left",
            leftAt: new Date(),
          },
        },
      )
      .exec();
  }
}
