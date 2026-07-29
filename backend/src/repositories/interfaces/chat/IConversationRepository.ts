import { ClientSession } from "mongoose";
import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationRepository
  extends IBaseRepository<IConversation> {
  createWithSession(
    data: Partial<IConversation>,
    session: ClientSession,
  ): Promise<IConversation>;

  findByDirectKey(
    directKey: string,
  ): Promise<IConversation | null>;

  findUserConversations(
    userId: string,
    limit: number,
    skip: number,
  ): Promise<IConversation[]>;

  findByIdsPaginated(
    ids: string[],
    limit: number,
    skip: number,
  ): Promise<IConversation[]>;

  findActiveConversation(
    conversationId: string,
  ): Promise<IConversation | null>;

  findGroups(
    limit: number,
    skip: number,
  ): Promise<IConversation[]>;

  countGroups(): Promise<number>;
}