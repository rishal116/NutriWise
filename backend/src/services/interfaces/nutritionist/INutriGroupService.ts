import { IConversation } from "../../../models/conversation.model";
import {

  GroupDetailsDto,
  GroupListResponseDto
} from "../../../dtos/nutritionist/group.dto";
import { JoinRequestDto } from "../../../dtos/nutritionist/joinRequest.dto";

export interface INutriGroupService {
  createGroup(
    userId: string,
    data: {
      title: string;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<IConversation>;

  getMyGroups(
    userId: string,
    role: "user" | "nutritionist",
    limit: number,
    cursor?: {
      lastMessageAt: string;
      id: string;
    },
  ): Promise<GroupListResponseDto>

  getGroupDetails(groupId: string): Promise<GroupDetailsDto>;

  getJoinRequests(groupId: string): Promise<JoinRequestDto[]>;

  acceptRequest(groupId: string, userId: string): Promise<void>;

  rejectRequest(groupId: string, userId: string): Promise<void>;
}
