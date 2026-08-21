import { ClientSession } from "mongoose";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IConversationService {
  createDirectConversation(
    dto: CreateDirectConversationDTO,
  ): Promise<ConversationResponseDTO>;

  createDirectConversationWithSession(
    dto: CreateDirectConversationDTO,
    session: ClientSession,
  ): Promise<ConversationResponseDTO>;

  getUserConversations(
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<ConversationResponseDTO>>;
}
