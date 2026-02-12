import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationRepository
  extends IBaseRepository<IConversation> {

  findByDirectKey(key: string): Promise<IConversation | null>;

  findUserConversations(userId: string): Promise<IConversation[]>;
}