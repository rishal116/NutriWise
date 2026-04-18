import { CreateDirectConversationDTO } from "../../../dtos/chat/createConversation.dto";
import { ConversationResponseDTO } from "../../../dtos/chat/conversationResponse.dto";

export interface IConversationService {
  createDirectConversation(
    dto: CreateDirectConversationDTO,
  ): Promise<ConversationResponseDTO>;

  getUserConversations(userId: string,context: "user" | "nutritionist",cursor: string | undefined,limit: number,
  ): Promise<{
    data: ConversationResponseDTO[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
}
