import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IMessageReceiptRepository } from "../../interfaces/chat/IMessageReceiptRepository";
import {
  MessageReceiptModel,
  IMessageReceipt,
} from "../../../models/messageReceipt.model";

export class MessageReceiptRepository
  extends BaseRepository<IMessageReceipt>
  implements IMessageReceiptRepository
{
  constructor() {
    super(MessageReceiptModel);
  }

  async findByMessage(
    messageId: string
  ): Promise<IMessageReceipt[]> {
    return this._model
      .find({
        messageId: new Types.ObjectId(messageId),
      })
      .lean<IMessageReceipt[]>();
  }

  async findByUser(userId: string): Promise<IMessageReceipt[]> {
    return this._model
      .find({
        userId: new Types.ObjectId(userId),
      })
      .lean<IMessageReceipt[]>();
  }

  async updateStatus(
    messageId: string,
    userId: string,
    status: "sent" | "delivered" | "seen"
  ): Promise<void> {

    const update: any = { status };

    if (status === "delivered") {
      update.deliveredAt = new Date();
    }

    if (status === "seen") {
      update.seenAt = new Date();
    }

    await this._model.updateOne(
      {
        messageId: new Types.ObjectId(messageId),
        userId: new Types.ObjectId(userId),
      },
      {
        $set: update,
      }
    );
  }
}