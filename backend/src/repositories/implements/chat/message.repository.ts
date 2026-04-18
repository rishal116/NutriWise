import { BaseRepository } from "../common/base.repository";
import { IMessageRepository } from "../../interfaces/chat/IMessageRepository";
import { MessageModel, IMessage } from "../../../models/message.model";
import { Types } from "mongoose";
import { FilterQuery } from "mongoose";

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
      .find({
        conversationId: new Types.ObjectId(conversationId),
        status: { $ne: "deleted" },
      })
      .sort({ createdAt: 1 })
      .lean<IMessage[]>()
      .exec();
  }

  async deleteById(id: string | Types.ObjectId): Promise<void> {
    await this._model.findByIdAndUpdate(
      id,
      {
        status: "deleted",
        deletedAt: new Date(),
      },
      { new: false },
    );
  }

  async findMessagesByConversationPaginated(
    conversationId: string,
    limit: number,
    cursor?: string,
  ): Promise<IMessage[]> {
    const query: FilterQuery<IMessage> = {
      conversationId: new Types.ObjectId(conversationId),
      status: { $ne: "deleted" },
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    return this._model
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IMessage[]>()
      .exec();
  }
}
