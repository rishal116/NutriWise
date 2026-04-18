import { IConversation } from "../../../models/conversation.model";
import {
  GroupDto,
  GroupDetailsDto,
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
    role: string,
    limit: number,
    skip: number,
  ): Promise<GroupDto[]>;

  getGroupDetails(groupId: string): Promise<GroupDetailsDto>;

  getJoinRequests(groupId: string): Promise<JoinRequestDto[]>;

  acceptRequest(groupId: string, userId: string): Promise<void>;

  rejectRequest(groupId: string, userId: string): Promise<void>;
}
