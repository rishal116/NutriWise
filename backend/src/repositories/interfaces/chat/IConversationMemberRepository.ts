import { IConversationMember } from "../../../models/conversationMember.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationMemberRepository
  extends IBaseRepository<IConversationMember> {

  findByConversationId(conversationId: string): Promise<IConversationMember[]>;
  findByConversationIds(
  conversationIds: string[]
): Promise<IConversationMember[]>;

  findByUser(userId: string): Promise<IConversationMember[]>;

  findMember(
    conversationId: string,
    userId: string
  ): Promise<IConversationMember | null>;

  incrementUnread(
    conversationId: string,
    senderId: string
  ): Promise<void>;

  resetUnread(
    conversationId: string,
    userId: string
  ): Promise<void>;
}