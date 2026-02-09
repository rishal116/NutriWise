import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationRepository
  extends IBaseRepository<IConversation> {
  findByConversationKey(key: string): Promise<IConversation | null>;
  findUserConversations(userId: string): Promise<IConversation[]>;
}
