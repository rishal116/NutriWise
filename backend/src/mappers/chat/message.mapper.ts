import { IMessage } from "../../models/message.model";
import { MessageResponseDTO } from "../../dtos/chat/messageResponse.dto";

export class MessageMapper {
  static toResponseDTO(message: IMessage): MessageResponseDTO {
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
      })),

      messageType: message.messageType,

      replyTo: message.replyTo?.toString(),

      status: message.status,

      editedAt: message.editedAt,

      deletedAt: message.deletedAt,

      createdAt: message.createdAt,

      updatedAt: message.updatedAt,
    };
  }
}
