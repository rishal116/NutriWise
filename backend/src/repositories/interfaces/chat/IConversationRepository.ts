import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IConversationRepository extends IBaseRepository<IConversation> {
  findByDirectKey(key: string): Promise<IConversation | null>;

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

  findGroups(limit: number, skip: number): Promise<IConversation[]>;

  countGroups(): Promise<number>;
}
