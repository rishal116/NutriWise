import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IConversationMemberRepository } from "../../interfaces/chat/IConversationMemberRepository";
import { ConversationMemberModel, IConversationMember } from "../../../models/conversationMember.model";

export class ConversationMemberRepository extends BaseRepository<IConversationMember>
implements IConversationMemberRepository {
  constructor() {
    super(ConversationMemberModel);
  }
  
  async findByConversationId(conversationId: string): Promise<IConversationMember[]> {
    return this._model.find({
      conversationId: new Types.ObjectId(conversationId),
      isLeft: false,
    }).lean<IConversationMember[]>();
  }
  
  async findByConversationIds(conversationIds: string[]): Promise<IConversationMember[]> {
    const objectIds = conversationIds.map(id => new Types.ObjectId(id));
    return this._model.find({
      conversationId: { $in: objectIds },
      isLeft: false,
    }).lean<IConversationMember[]>();
  }
  
  async findByUser(userId: string): Promise<IConversationMember[]> {
    return this._model.find({
      userId: new Types.ObjectId(userId),
      isLeft: false,
    }).sort({ updatedAt: -1 }).lean<IConversationMember[]>();
  }
  
  async findMember(conversationId: string,userId: string): Promise<IConversationMember | null> {
    return this._model.findOne({
      conversationId: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
      isLeft: false,
    }).lean<IConversationMember | null>();
  }
  
  async incrementUnread(conversationId: string,senderId: string): Promise<void> {
    await this._model.updateMany({
      conversationId: new Types.ObjectId(conversationId),
      userId: { $ne: new Types.ObjectId(senderId) },
    },
    {
      $inc: { unreadCount: 1 },
    });
  }
  
  async resetUnread(conversationId: string,userId: string): Promise<void> {
    await this._model.updateOne({
      conversationId: new Types.ObjectId(conversationId),
      userId: new Types.ObjectId(userId),
    },
    {
      $set: { unreadCount: 0, lastReadAt: new Date() },
    });
  }

}