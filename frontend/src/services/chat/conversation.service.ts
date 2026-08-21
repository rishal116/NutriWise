import { clientApi } from "@/lib/axios/clientApi";
import { CONVERSATION_ROUTES } from "@/routes/chat";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";

export const conversationService = {
  createConversation: async (
    otherUserId: string,
  ): Promise<ApiResponseDTO<ConversationResponseDTO>> => {
    const res = await clientApi.post<ApiResponseDTO<ConversationResponseDTO>>(
      CONVERSATION_ROUTES.CREATE,
      {
        otherUserId,
      },
    );

    return res.data;
  },

  getConversations: async (
    limit: number = 20,
    cursor?: string,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<ConversationResponseDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ConversationResponseDTO>>
    >(CONVERSATION_ROUTES.LIST, {
      params: {
        limit,
        ...(cursor ? { cursor } : {}),
      },
    });

    return res.data;
  },
};
