import { ClientSession } from "mongoose";
import { ConversationResponseDTO } from "../../../dtos/chat/conversation-response.dto";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { ConversationListItemDTO } from "../../../dtos/chat/conversation-list-item.dto";
import { ConversationListFilter } from "../../../types/chat/conversation-list.types";

export interface IConversationService {
  createDirectConversation(
    dto: CreateDirectConversationDTO,
    session?: ClientSession,
  ): Promise<ConversationResponseDTO>;

  getUserConversations(
    userId: string,
    limit: number,
    cursor?: string,
    filter?: ConversationListFilter,
    search?: string,
  ): Promise<InfiniteScrollResponseDTO<ConversationListItemDTO>>;

  getUserConversationDetails(
    userId: string,
    conversationId: string,
  ): Promise<ConversationResponseDTO>;
}
