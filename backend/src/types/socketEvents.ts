import { MessageResponseDTO } from "../dtos/chat/messageResponse.dto";

export interface SocketEvents {

  receiveMessage: MessageResponseDTO;

  messagesRead: {
    conversationId: string;
    userId: string;
  };

  userTyping: {
    conversationId: string;
    userId: string;
  };

  userStoppedTyping: {
    conversationId: string;
    userId: string;
  };

  messageDeleted: {
    conversationId: string;
    messageId: string;
  };

  messageEdited: {
    conversationId: string;
    messageId: string;
    content: string;
  };

}