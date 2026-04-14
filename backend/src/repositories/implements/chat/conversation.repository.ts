import { BaseRepository } from "../common/base.repository";
import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";
import {
  ConversationModel,
  IConversation,
} from "../../../models/conversation.model";
import { Types } from "mongoose";
import { ConversationMemberModel } from "../../../models/conversationMember.model";

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
      .lean<IConversation | null>()
      .exec();
  }

  async findUserConversations(userId: string): Promise<IConversation[]> {
    const memberships = await ConversationMemberModel.find({
      userId: new Types.ObjectId(userId),
    })
      .select("conversationId")
      .lean()
      .exec();

    const conversationIds = memberships.map((m) => m.conversationId);

    if (conversationIds.length === 0) return [];

    return this._model
      .find({
        _id: { $in: conversationIds },
        isDeleted: false,
      })
      .sort({ lastMessageAt: -1 })
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
        _id: { $in: ids.map((id) => new Types.ObjectId(id)) },
        isDeleted: false,
      })
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IConversation[]>()
      .exec();
  }

  async findGroups(limit: number, skip: number) {
    return this._model
      .find({
        chatType: "group",
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IConversation[]>()
      .exec();
  }

  async countGroups() {
    return this._model.countDocuments({
      chatType: "group",
      isDeleted: false,
    });
  }
}
