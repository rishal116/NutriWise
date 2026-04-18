import { IConversation } from "../../models/conversation.model";
import { ConversationResponseDTO } from "../../dtos/chat/conversationResponse.dto";
import { IUser } from "../../models/user.model";

export class ConversationMapper {
  static toResponseDTO(
    conversation: IConversation,
    otherUser?: IUser | null,
    lastMessage?: string | null,
    memberCount?: number
  ): ConversationResponseDTO {

    const isDirect = conversation.chatType === "direct";

    return {
      id: conversation._id.toString(),
      chatType: conversation.chatType,

     
      otherUserName: isDirect ? otherUser?.fullName || null : undefined,
      otherUserProfile: isDirect ? otherUser?.profileImage || null : undefined,

    
      title: !isDirect ? conversation.title : undefined,
      groupAvatar: !isDirect ? conversation.groupAvatar : undefined,
      memberCount: !isDirect ? memberCount ?? conversation.memberCount : undefined,

  
      lastMessageId: conversation.lastMessageId?.toString(),
      lastMessageAt: conversation.lastMessageAt,
      lastMessage: lastMessage || null,
    };
  }
}