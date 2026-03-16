import { IMessageReceipt } from "../../../models/messageReceipt.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IMessageReceiptRepository
  extends IBaseRepository<IMessageReceipt> {

  findByMessage(messageId: string): Promise<IMessageReceipt[]>;

  findByUser(userId: string): Promise<IMessageReceipt[]>;

  updateStatus(
    messageId: string,
    userId: string,
    status: "sent" | "delivered" | "seen"
  ): Promise<void>;
}