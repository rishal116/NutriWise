import { MessageResponseDTO } from "../../dtos/chat/message-response.dto";
import { IMessageListItem } from "../../types/chat/message.types";

export class MessageMapper {
  static toResponseDTO(message: IMessageListItem): MessageResponseDTO {
    return {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.senderId.toString(),
      text: message.text,
      attachments: message.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        size: attachment.size,
        mimeType: attachment.mimeType,
        duration: attachment.duration,
      })),
      messageType: message.messageType,
      replyTo: message.replyTo?.toString(),
      status: message.status,
      editedAt: message.editedAt,
      deletedAt: message.deletedAt,
      createdAt: message.createdAt,
    };
  }
}
