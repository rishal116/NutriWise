import { clientApi } from "@/lib/axios/clientApi";
import { MESSAGE_ROUTES } from "@/routes/chat";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageType } from "@/types/chat/message.types";

export const MessageService = {
  getMessages: async (
    conversationId: string,
    limit: number = 30,
    cursor?: string,
  ): Promise<ApiResponseDTO<InfiniteScrollResponseDTO<MessageResponseDTO>>> => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<MessageResponseDTO>>
    >(MESSAGE_ROUTES.LIST(conversationId), {
      params: {
        limit,
        ...(cursor ? { cursor } : {}),
      },
    });

    return res.data;
  },

  sendMessage: async (
    conversationId: string,
    text: string,
    messageType: MessageType = MessageType.TEXT,
  ): Promise<ApiResponseDTO<MessageResponseDTO>> => {
    const res = await clientApi.post<ApiResponseDTO<MessageResponseDTO>>(
      MESSAGE_ROUTES.CREATE,
      {
        conversationId,
        text,
        messageType,
      },
    );

    return res.data;
  },

  sendFile: async (
    conversationId: string,
    file: File,
  ): Promise<ApiResponseDTO<MessageResponseDTO>> => {
    const formData = new FormData();

    formData.append("conversationId", conversationId);
    formData.append("file", file);
    formData.append("messageType", MessageType.FILE);

    const res = await clientApi.post<ApiResponseDTO<MessageResponseDTO>>(
      MESSAGE_ROUTES.FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return res.data;
  },

  markAsRead: async (conversationId: string): Promise<ApiResponseDTO<null>> => {
    const res = await clientApi.patch<ApiResponseDTO<null>>(
      MESSAGE_ROUTES.MARK_AS_READ(conversationId),
    );

    return res.data;
  },

  editMessage: async (
    messageId: string,
    text: string,
  ): Promise<ApiResponseDTO<MessageResponseDTO>> => {
    const res = await clientApi.patch<ApiResponseDTO<MessageResponseDTO>>(
      MESSAGE_ROUTES.EDIT(messageId),
      {
        text,
      },
    );

    return res.data;
  },

  deleteMessage: async (messageId: string): Promise<ApiResponseDTO<null>> => {
    const res = await clientApi.patch<ApiResponseDTO<null>>(
      MESSAGE_ROUTES.DELETE(messageId),
    );

    return res.data;
  },
};
