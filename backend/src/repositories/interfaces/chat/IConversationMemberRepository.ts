import { ClientSession } from "mongoose";
import { IConversationMember } from "../../../models/conversationMember.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationMemberRepository extends IBaseRepository<IConversationMember> {
  createMany(
    data: Partial<IConversationMember>[],
  ): Promise<IConversationMember[]>;

  createManyWithSession(
    data: Partial<IConversationMember>[],
    session: ClientSession,
  ): Promise<IConversationMember[]>;

  findByConversationId(conversationId: string): Promise<IConversationMember[]>;

  findByConversationIds(
    conversationIds: string[],
  ): Promise<IConversationMember[]>;

  findByUser(userId: string): Promise<IConversationMember[]>;

  findMember(
    conversationId: string,
    userId: string,
  ): Promise<IConversationMember | null>;

  leaveConversation(conversationId: string, userId: string): Promise<void>;

  incrementUnread(conversationId: string, senderId: string): Promise<void>;

  resetUnread(conversationId: string, userId: string): Promise<void>;
}
