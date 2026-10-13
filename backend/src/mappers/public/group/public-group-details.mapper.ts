import type { IConversation } from "../../../models/conversation.model";

import type { PublicGroupDetailsDTO } from "../../../dtos/public/group/public-group-details.dto";

export const toPublicGroupDetailsDTO = (
  group: IConversation,
  memberCount: number,
  isMember: boolean,
): PublicGroupDetailsDTO => ({
  id: group._id.toString(),
  title: group.title ?? "",
  description: group.description,
  groupAvatar: group.groupAvatar,
  visibility: "public",
  status: "active",
  memberCount,
  isMember,
  createdAt: group.createdAt,
  updatedAt: group.updatedAt,
});
