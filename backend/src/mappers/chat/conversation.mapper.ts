import { IConversation } from "../../models/conversation.model";
import { ConversationResponseDTO } from "../../dtos/chat/conversation-response.dto";
import { IUser } from "../../models/user.model";
import { IConversationDetails } from "../../types/chat/conversation.types";

export class ConversationMapper {
  static toResponseDTO(
    conversation: IConversation,
    participant?: IUser | null,
    unreadCount = 0,
    isMuted = false,
    isArchived = false,
  ): ConversationResponseDTO {
    const isGroup = conversation.chatType === "group";

    return {
      id: conversation._id.toString(),
      chatType: conversation.chatType,
      purpose: conversation.purpose,
      status: conversation.status,
      title: isGroup ? conversation.title : undefined,
      avatar: isGroup ? conversation.groupAvatar : participant?.profileImage,
      description: isGroup ? conversation.description : undefined,
      participant:
        !isGroup && participant
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

  static toResponseDTOFromDetails(
    conversation: IConversationDetails,
  ): ConversationResponseDTO {
    const isGroup = conversation.chatType === "group";

    return {
      id: conversation.conversationId.toString(),
      chatType: conversation.chatType,
      purpose: conversation.purpose,
      status: conversation.status,
      title: isGroup ? conversation.title : undefined,
      avatar: isGroup
        ? conversation.groupAvatar
        : conversation.participant?.profileImage,
      description: isGroup ? conversation.description : undefined,
      participant:
        !isGroup && conversation.participant
          ? {
              id: conversation.participant.userId.toString(),
              name: conversation.participant.fullName,
              profileImage: conversation.participant.profileImage,
            }
          : undefined,
      lastMessage: conversation.lastMessagePreview,
      lastActivityAt: conversation.lastActivityAt,
      unreadCount: conversation.unreadCount,
      isMuted: conversation.isMuted,
      isArchived: conversation.isArchived,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}
