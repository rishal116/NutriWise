import { ClientSession, Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";

import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";

import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";

import { ConversationMemberModel } from "../../../models/conversationMember.model";

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

  async createWithSession(
    data: Partial<IConversation>,
    session: ClientSession,
  ): Promise<IConversation> {
    const [conversation] = await this._model.create([data], {
      session,
    });

    return conversation;
  }

  async findByDirectKey(directKey: string): Promise<IConversation | null> {
    return this._model
      .findOne({
        directKey,
        chatType: "direct",
        status: "active",
      })
      .lean<IConversation | null>()
      .exec();
  }

  async findUserConversations(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<IConversation[]> {
    const memberships = await ConversationMemberModel.find({
      userId: this.toObjectId(userId),
      status: "active",
    })
      .select("conversationId")
      .lean()
      .exec();

    const conversationIds = memberships.map((member) => member.conversationId);

    if (conversationIds.length === 0) {
      return [];
    }

    return this._model
      .find({
        _id: {
          $in: conversationIds,
        },
        status: {
          $ne: "closed",
        },
      })
      .sort({
        lastActivityAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean<IConversation[]>()
      .exec();
  }

  async findByIdsPaginated(
    ids: string[],
    limit: number,
    skip: number,
  ): Promise<IConversation[]> {
    return this._model
      .find({
        _id: {
          $in: ids.map((id) => this.toObjectId(id)),
        },
        status: {
          $ne: "closed",
        },
      })
      .sort({
        lastActivityAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean<IConversation[]>()
      .exec();
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
