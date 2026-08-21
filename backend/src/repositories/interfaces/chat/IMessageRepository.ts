import { IMessage } from "../../../models/message.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { CursorData } from "../../../types/cursor.types";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";

export interface IMessageRepository extends IBaseRepository<IMessage> {
  findMessagesByConversation(
    conversationId: string,
    limit: number,
    cursor?: CursorData,
  ): Promise<CursorPaginationResult<IMessage>>;

  deleteById(id: string): Promise<void>;
}
