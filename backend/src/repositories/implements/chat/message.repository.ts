import { BaseRepository } from "../common/base.repository";
import { IMessageRepository } from "../../interfaces/chat/IMessageRepository";
import { MessageModel, IMessage } from "../../../models/message.model";
import { Types } from "mongoose";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  async findMessagesByConversation(
    conversationId: string
  ): Promise<IMessage[]> {

    return this._model
      .find({
        conversationId: conversationId,
        isDeleted: false
      })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>();

  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {

    await this._model.findByIdAndUpdate(
      id,
      {
        isDeleted: true
      },
      { new: true }
    );

  }
}