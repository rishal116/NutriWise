import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
import { SendFileDTO } from "../../../dtos/chat/sendFile.dto";

export interface IMessageService {
  sendMessage(dto: SendMessageDTO): Promise<MessageResponseDTO>;
  getMessages(
    conversationId: string,
    limit: number,
    cursor?: string,
  ): Promise<MessageResponseDTO[]>;

  sendFile(dto: SendFileDTO): Promise<MessageResponseDTO>;

  markAsRead(conversationId: string, userId: string): Promise<void>;

  deleteMessage(messageId: string, userId: string): Promise<void>;

  editMessage(
    messageId: string,
    text: string,
    userId: string,
  ): Promise<MessageResponseDTO>;
}
