
import { IMessage } from "../models/message.model";
import { MessageResponseDTO } from "../dtos/chat/messageResponse.dto";

export class MessageMapper {
  static toResponseDTO(message: IMessage): MessageResponseDTO {
    return {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.senderId.toString(),
      content: message.text ?? "",
      mediaUrl: message.fileUrl ?? "",
      type: message.messageType,
      createdAt: message.createdAt,
    };
  }
}
