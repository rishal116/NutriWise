import { IMessage } from "../../../models/message.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { IMessageListItem } from "../../../types/chat/message.types";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findMessagesByConversation(
    conversationId: string,
    limit: number,
    cursor?: string,
  ): Promise<CursorPaginationResult<IMessageListItem>>;

  deleteById(id: string): Promise<void>;
}
