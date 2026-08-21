import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

export interface IMessageService {
  sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO>;

  getMessages(
    conversationId: string,
    userId: string,
    limit: number,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<MessageResponseDTO>>;

  sendFile(dto: {
    conversationId: string;
    senderId: string;
    file?: Express.Multer.File;
  }): Promise<MessageResponseDTO>;

  markAsRead(conversationId: string, userId: string): Promise<void>;

  deleteMessage(messageId: string, userId: string): Promise<void>;

  editMessage(
    messageId: string,
    text: string,
    userId: string,
  ): Promise<MessageResponseDTO>;
}
