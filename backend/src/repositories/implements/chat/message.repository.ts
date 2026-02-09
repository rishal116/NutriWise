import { BaseRepository } from "../common/base.repository";
import { IMessageRepository } from "../../interfaces/chat/IMessageRepository";
import { MessageModel, IMessage } from "../../../models/message.model";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  async findMessagesByConversation(
    conversationId: string,
    page: number,
    limit: number
  ): Promise<IMessage[]> {
    const skip = (page - 1) * limit;

    return this._model
      .find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IMessage[]>();
  }
}
