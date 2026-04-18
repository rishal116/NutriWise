import { IConversation } from "../../models/conversation.model";
import { GroupDto } from "../../dtos/nutritionist/group.dto";

export class GroupMapper {
  static toDto(
    conversation: IConversation,
    memberCount: number,
  ): GroupDto {
    return {
      id: conversation._id.toString(),
      title: conversation.title,
      description: conversation.description,
      visibility: conversation.visibility,
      memberCount,
      lastMessageAt: conversation.lastMessageAt,
    };
  }
}