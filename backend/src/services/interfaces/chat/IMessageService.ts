import { SendMessageDTO } from "../../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

export interface IMessageService {
  sendMessage(
    dto: SendMessageDTO
  ): Promise<MessageResponseDTO>;

  getMessages(
    conversationId: string,
  ): Promise<MessageResponseDTO[]>;
}
