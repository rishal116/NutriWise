import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

export interface IChatService {
  createDirectConversation(
    dto: CreateDirectConversationDTO
  ): Promise<ConversationResponseDTO>;

  sendMessage(
    dto: SendMessageDTO
  ): Promise<MessageResponseDTO>;

  getUserConversations(
    userId: string
  ): Promise<ConversationResponseDTO[]>;

  getMessages(
    conversationId: string,
    page: number,
    limit: number
  ): Promise<MessageResponseDTO[]>;
}
