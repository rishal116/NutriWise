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
  ): Promise<IMessage[]> {

    return this._model
      .find({ conversationId: conversationId })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>();
  }
}
