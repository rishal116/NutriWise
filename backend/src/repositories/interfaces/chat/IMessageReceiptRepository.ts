import { IMessageReceipt } from "../../../models/messageReceipt.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { ReceiptStatus } from "../../../models/messageReceipt.model";

export interface IMessageReceiptRepository extends IBaseRepository<IMessageReceipt> {
  findByMessage(messageId: string): Promise<IMessageReceipt[]>;

  updateStatus(
    messageId: string,
    conversationId: string,
    userId: string,
    status: ReceiptStatus,
  ): Promise<void>;

  markConversationAsSeen(conversationId: string, userId: string): Promise<void>;
}
