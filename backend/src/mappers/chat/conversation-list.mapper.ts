import { ConversationListItemDTO } from "../../dtos/chat/conversation-list-item.dto";
import { IConversationListItem } from "../../types/chat/conversation.types";

export const toConversationListItemDTO = (
  conversation: IConversationListItem,
): ConversationListItemDTO => {
  const isDirect = conversation.chatType === "direct";

  return {
    conversationId: conversation.conversationId.toString(),
    chatType: conversation.chatType,
    title: isDirect
      ? (conversation.otherUsername ?? "Unknown User")
      : (conversation.title ?? "Untitled Group"),
    avatar: isDirect
      ? conversation.otherProfileImage
      : conversation.groupAvatar,
    lastMessagePreview: conversation.lastMessagePreview,
    lastActivityAt: conversation.lastActivityAt?.toISOString(),
    unreadCount: conversation.unreadCount,
    isMuted: conversation.isMuted,
    isArchived: conversation.isArchived,
  };
};
