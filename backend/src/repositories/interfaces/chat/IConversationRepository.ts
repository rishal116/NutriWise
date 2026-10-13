import { ClientSession } from "mongoose";
import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import {
  IConversationDetails,
  IConversationListItem,
} from "../../../types/chat/conversation.types";
import { ConversationListFilter } from "../../../types/chat/conversation-list.types";

export interface IConversationRepository extends IBaseRepository<IConversation> {
  findByDirectKey(
    directKey: string,
    session?: ClientSession,
  ): Promise<IConversation | null>;

  findUserConversations(
    userId: string,
    limit: number,
    cursor?: string,
    filter?: ConversationListFilter,
    search?: string,
  ): Promise<CursorPaginationResult<IConversationListItem>>;

  findUserConversationDetails(
    userId: string,
    conversationId: string,
  ): Promise<IConversationDetails | null>;

  findActiveConversation(conversationId: string): Promise<IConversation | null>;

  countGroups(): Promise<number>;

  findPrivateGroupByInviteTokenHash(
    inviteTokenHash: string,
  ): Promise<IConversation | null>;

  updatePrivateGroupInviteToken(
    conversationId: string,
    inviteToken: string,
    inviteTokenHash: string,
  ): Promise<boolean>;
}
