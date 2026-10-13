import { injectable } from "inversify";
import { ClientSession, Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IConversationMemberRepository } from "../../interfaces/chat/IConversationMemberRepository";
import {
  ConversationMemberModel,
  IConversationMember,
} from "../../../models/conversationMember.model";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
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

  async createMany(
    data: Partial<IConversationMember>[],
  ): Promise<IConversationMember[]> {
    const documents = await this._model.insertMany(data);

    return documents.map(
      (document) => document.toObject() as IConversationMember,
    );
  }

  async createManyWithSession(
    data: Partial<IConversationMember>[],
    session: ClientSession,
  ): Promise<IConversationMember[]> {
    const documents = await this._model.insertMany(data, {
      session,
    });

    return documents.map(
      (document) => document.toObject() as IConversationMember,
    );
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
    if (conversationIds.length === 0) {
      return [];
    }

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

  async joinGroup(
    conversationId: string,
    userId: string,
  ): Promise<"joined" | "already-member" | "blocked"> {
    const conversationObjectId = this.toObjectId(conversationId);
    const userObjectId = this.toObjectId(userId);

    const existingMember = await this._model
      .findOne({
        conversationId: conversationObjectId,
        userId: userObjectId,
      })
      .lean<IConversationMember | null>()
      .exec();

    if (existingMember?.status === "active") {
      return "already-member";
    }

    if (existingMember?.status === "blocked") {
      return "blocked";
    }

    if (existingMember) {
      await this._model.updateOne(
        {
          _id: existingMember._id,
          status: { $in: ["left", "removed"] },
        },
        {
          $set: {
            status: "active",
            role: "member",
            joinedAt: new Date(),
            unreadCount: 0,
          },
          $unset: {
            leftAt: 1,
          },
        },
      );

      const updatedMember = await this._model
        .findById(existingMember._id)
        .lean<IConversationMember | null>()
        .exec();

      if (updatedMember?.status === "active") {
        return "joined";
      }

      throw new CustomError(
        "Unable to join this group. Please try again.",
        StatusCode.CONFLICT,
      );
    }

    try {
      await this._model.create({
        conversationId: conversationObjectId,
        userId: userObjectId,
        role: "member",
        status: "active",
        joinedAt: new Date(),
        unreadCount: 0,
      });

      return "joined";
    } catch (error: unknown) {
      const memberAfterConflict = await this._model
        .findOne({
          conversationId: conversationObjectId,
          userId: userObjectId,
        })
        .lean<IConversationMember | null>()
        .exec();

      if (memberAfterConflict?.status === "active") {
        return "already-member";
      }

      if (memberAfterConflict?.status === "blocked") {
        return "blocked";
      }

      throw error;
    }
  }
  async countActiveMembers(conversationId: string): Promise<number> {
    return this._model
      .countDocuments({
        conversationId: this.toObjectId(conversationId),
        status: "active",
      })
      .exec();
  }
}
