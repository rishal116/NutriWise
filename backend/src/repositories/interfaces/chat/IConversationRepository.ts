import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

export type ConversationCursor = {
  lastMessageAt: string;
  id: string;
};

export interface IConversationRepository extends IBaseRepository<IConversation> {
  findByDirectKey(key: string): Promise<IConversation | null>;

  findUserConversations(
    userId: string,
    limit: number,
    cursor?: ConversationCursor,
  ): Promise<IConversation[]>;

  findUserConversationsPaginated(
    conversationIds: string[],
    limit: number,
    cursor?: ConversationCursor,
  ): Promise<IConversation[]>;

  findGroups(
    limit: number,
    cursor?: string,
  ): Promise<IConversation[]>;

  incrementMemberCount(
    groupId: string,
    value: number,
  ): Promise<void>;

  countGroups(): Promise<number>;
}