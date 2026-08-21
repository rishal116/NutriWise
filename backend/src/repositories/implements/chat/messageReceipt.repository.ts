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

  async updateStatus(
    messageId: string,
    conversationId: string,
    userId: string,
    status: ReceiptStatus,
  ): Promise<void> {
    const messageObjectId = new Types.ObjectId(messageId);
    const conversationObjectId = new Types.ObjectId(conversationId);
    const userObjectId = new Types.ObjectId(userId);

    const statusOrder: Record<ReceiptStatus, number> = {
      [ReceiptStatus.SENT]: 1,
      [ReceiptStatus.DELIVERED]: 2,
      [ReceiptStatus.SEEN]: 3,
    };

    const existingReceipt = await this._model.findOne({
      messageId: messageObjectId,
      userId: userObjectId,
    });

    if (
      existingReceipt &&
      statusOrder[status] <= statusOrder[existingReceipt.status]
    ) {
      return;
    }

    const update: UpdateQuery<IMessageReceipt> = {
      status,
    };

    if (status === ReceiptStatus.DELIVERED) {
      update.deliveredAt = new Date();
    }

    if (status === ReceiptStatus.SEEN) {
      update.seenAt = new Date();

      if (!existingReceipt?.deliveredAt) {
        update.deliveredAt = new Date();
      }
    }

    await this._model.updateOne(
      {
        messageId: messageObjectId,
        userId: userObjectId,
      },
      {
        $set: update,
        $setOnInsert: {
          conversationId: conversationObjectId,
        },
      },
      {
        upsert: true,
      },
    );
  }

  async markConversationAsSeen(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    await this._model
      .updateMany(
        {
          conversationId: new Types.ObjectId(conversationId),
          userId: new Types.ObjectId(userId),
          status: {
            $ne: ReceiptStatus.SEEN,
          },
        },
        {
          $set: {
            status: ReceiptStatus.SEEN,
            seenAt: new Date(),
          },
        },
      )
      .exec();
  }
}
