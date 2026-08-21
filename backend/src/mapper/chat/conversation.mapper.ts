import { IConversation } from "../../models/conversation.model";
import { ConversationResponseDTO } from "../../dtos/chat/conversationResponse.dto";
import { IUser } from "../../models/user.model";

export class ConversationMapper {
  static toResponseDTO(
    conversation: IConversation,
    participant?: IUser | null,
    unreadCount = 0,
    isMuted = false,
    isArchived = false,
  ): ConversationResponseDTO {
    return {
      id: conversation._id.toString(),

      chatType: conversation.chatType,
      purpose: conversation.purpose,
      status: conversation.status,

      title: conversation.title,
      groupAvatar: conversation.groupAvatar,
      description: conversation.description,

      participant: participant
        ? {
            id: participant._id.toString(),
            name: participant.fullName,
            profileImage: participant.profileImage,
          }
        : undefined,

      lastMessage: conversation.lastMessagePreview,

      lastActivityAt: conversation.lastActivityAt,

      unreadCount,
      isMuted,
      isArchived,

      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
