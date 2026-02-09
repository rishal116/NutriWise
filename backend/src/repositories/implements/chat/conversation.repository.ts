import { BaseRepository } from "../common/base.repository";
import { IConversationRepository } from "../../interfaces/chat/IConversationRepository";
import { ConversationModel, IConversation } from "../../../models/conversation.model";

export class ConversationRepository
  extends BaseRepository<IConversation>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }

  async findByConversationKey(
    key: string
  ): Promise<IConversation | null> {
    return this._model.findOne({ conversationKey: key }).lean<IConversation | null>();
  }

  async findUserConversations(
    userId: string
  ): Promise<IConversation[]> {
    return this._model
      .find({ participants: userId })
      .sort({ lastMessageAt: -1 })
      .lean<IConversation[]>();
  }
}
