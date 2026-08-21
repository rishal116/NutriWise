import { ClientSession } from "mongoose";

import { IConversation } from "../../../models/conversation.model";
import { IBaseRepository } from "../common/IBaseRepository";

import { CursorData } from "../../../types/cursor.types";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IConversationRepository extends IBaseRepository<IConversation> {
  findByDirectKey(
    directKey: string,
    session?: ClientSession,
  ): Promise<IConversation | null>;

  findUserConversations(
    userId: string,
    limit: number,
    cursor?: CursorData,
  ): Promise<CursorPaginationResult<IConversation>>;

  findActiveConversation(conversationId: string): Promise<IConversation | null>;

  findGroups(limit: number, skip: number): Promise<IConversation[]>;

  countGroups(): Promise<number>;
}
