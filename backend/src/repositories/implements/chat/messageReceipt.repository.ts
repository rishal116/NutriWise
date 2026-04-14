import { Types, UpdateQuery } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IMessageReceiptRepository } from "../../interfaces/chat/IMessageReceiptRepository";
import {
  MessageReceiptModel,
  IMessageReceipt,
  ReceiptStatus,
} from "../../../models/messageReceipt.model";

export class MessageReceiptRepository
  extends BaseRepository<IMessageReceipt>
  implements IMessageReceiptRepository
{
  constructor() {
    super(MessageReceiptModel);
  }

  async findByMessage(messageId: string): Promise<IMessageReceipt[]> {
    return this._model
      .find({
        messageId: new Types.ObjectId(messageId),
      })
      .lean<IMessageReceipt[]>()
      .exec();
  }

  async findByUser(userId: string): Promise<IMessageReceipt[]> {
    return this._model
      .find({
        userId: new Types.ObjectId(userId),
      })
      .lean<IMessageReceipt[]>()
      .exec();
  }

  async updateStatus(
    messageId: string,
    userId: string,
    status: ReceiptStatus,
  ): Promise<void> {
    const update: UpdateQuery<IMessageReceipt> = {
      status,
    };

    if (status === ReceiptStatus.DELIVERED) {
      update.deliveredAt = new Date();
    }

    if (status === ReceiptStatus.SEEN) {
      update.seenAt = new Date();
    }

    await this._model
      .updateOne(
        {
          messageId: new Types.ObjectId(messageId),
          userId: new Types.ObjectId(userId),
        },
        {
          $set: update,
        },
        {
          upsert: true,
        },
      )
      .exec();
  }
}
