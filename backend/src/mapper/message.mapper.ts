import { IMessage } from "../models/message.model";
import { MessageResponseDTO } from "../dtos/chat/messageResponse.dto";

export class MessageMapper {

  static toResponseDTO(message: IMessage): MessageResponseDTO {

    return {
      id: message._id.toString(),
      conversationId: message.conversationId.toString(),
      senderId: message.senderId.toString(),
      content: message.text ?? "",
      isEdited:message.status === "edited",
      attachments: message.attachments?.map((a) => ({
        url: a.url,
        fileName: a.fileName
      })),
      type: message.messageType,
      editedAt:message.editedAt,
      createdAt: message.createdAt,
    };

  }

}