import { IConversation } from "../../models/conversation.model";
import { ConversationResponseDTO } from "../../dtos/chat/conversationResponse.dto";
import { IUser } from "../../models/user.model";

export class ConversationMapper {

  static toResponseDTO(
    conversation: IConversation,
    otherUser?: IUser | null,
    lastMessage?: string | null
  ): ConversationResponseDTO {

    return {
      id: conversation._id.toString(),
      chatType: conversation.chatType,
      title: conversation.title,
      groupAvatar: conversation.groupAvatar,
      adminId: conversation.adminId?.toString(),
      lastMessageId: conversation.lastMessageId?.toString(),
      lastMessageAt: conversation.lastMessageAt,

      otherUserName: otherUser?.fullName || null,
      otherUserProfile: otherUser?.profileImage || null,
      lastMessage: lastMessage || null ,
    };
  }
}