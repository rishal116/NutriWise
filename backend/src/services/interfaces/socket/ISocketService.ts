import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

export interface ISocketService {

  emitNewMessage(
    conversationId: string,
    message: MessageResponseDTO
  ): void;

  emitMessageEdited(
    conversationId: string,
    messageId: string,
    content: string
  ): void;

  emitMessageDeleted(
    conversationId: string,
    messageId: string
  ): void;

  emitMessagesRead(
    conversationId: string,
    userId: string
  ): void;

}