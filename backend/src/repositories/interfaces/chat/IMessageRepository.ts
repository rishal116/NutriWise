import { IMessage } from "../../../models/message.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IMessageRepository
  extends IBaseRepository<IMessage> {
  findMessagesByConversation(
    conversationId: string,
  ): Promise<IMessage[]>;
}
