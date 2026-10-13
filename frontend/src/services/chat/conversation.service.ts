import { clientApi } from "@/lib/axios/clientApi";

import { CONVERSATION_ROUTES } from "@/routes/chat";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { ConversationResponseDTO } from "@/dtos/chat/conversation-response.dto";

import { ConversationListQueryDTO } from "@/dtos/chat/conversation-list-query.dto";

import { ConversationListItemDTO } from "@/dtos/chat/conversation-list-item.dto";

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
    params: ConversationListQueryDTO = {},
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<ConversationListItemDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<ConversationListItemDTO>>
    >(CONVERSATION_ROUTES.LIST, {
      params,
    });

    return res.data;
  },

  getConversationDetails: async (
    conversationId: string,
  ): Promise<ApiResponseDTO<ConversationResponseDTO>> => {
    const res = await clientApi.get<ApiResponseDTO<ConversationResponseDTO>>(
      CONVERSATION_ROUTES.DETAILS(conversationId),
    );

    return res.data;
  },
};
