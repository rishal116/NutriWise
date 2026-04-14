import { IConversationMember } from "../../../models/conversationMember.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationMemberRepository extends IBaseRepository<IConversationMember> {
  createMany(
    data: Partial<IConversationMember>[],
  ): Promise<IConversationMember[]>;

  findByConversationId(conversationId: string): Promise<IConversationMember[]>;

  findByConversationIds(
    conversationIds: string[],
  ): Promise<IConversationMember[]>;

  findByUser(
    userId: string,
    roleContext: "user" | "nutritionist",
  ): Promise<IConversationMember[]>;

  findMember(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ): Promise<IConversationMember | null>;

  exists(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ): Promise<boolean>;

  addMembers(
    conversationId: string,
    members: {
      userId: string;
      roleContext: "user" | "nutritionist";
      role?: "member" | "admin" | "owner";
    }[],
  ): Promise<void>;

  leaveConversation(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ): Promise<void>;

  incrementUnread(
    conversationId: string,
    senderId: string,
    senderContext: "user" | "nutritionist",
  ): Promise<void>;

  incrementUnreadForGroup(
    conversationId: string,
    senderId: string,
  ): Promise<void>;

  resetUnread(
    conversationId: string,
    userId: string,
    roleContext: "user" | "nutritionist",
  ): Promise<void>;
}
