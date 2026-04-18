import { Types } from "mongoose";
import { IMessage } from "../../../models/message.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findMessagesByConversation(conversationId: string): Promise<IMessage[]>;
  findMessagesByConversationPaginated(
    conversationId: string,
    limit: number,
    cursor?: string
  ): Promise<IMessage[]>;

  deleteById(id: string | Types.ObjectId): Promise<void>;
}
