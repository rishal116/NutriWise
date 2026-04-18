import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

import { UpdateResult } from "mongodb";

type JoinRequestInput = {
  userId: string;
  requestedAt: Date;
};

export interface IConversationRepository extends IBaseRepository<IConversation> {
  findByDirectKey(key: string): Promise<IConversation | null>;

  findUserConversations(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<IConversation[]>;


  findUserConversationsPaginated(
  conversationIds: string[],
  limit: number,
  cursor?: string,
): Promise<IConversation[]>;

  findGroups(limit: number, cursor?: string): Promise<IConversation[]>;

  incrementMemberCount(groupId: string, value: number): Promise<void>;

  countGroups(): Promise<number>;

  addJoinRequest(
    groupId: string,
    request: JoinRequestInput,
  ): Promise<UpdateResult>;
}
