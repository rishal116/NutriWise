import type { PublicGroupListItem } from "../../../types/public/group/public-group-list-item.type";

import type { PublicGroupListItemDTO } from "../../../dtos/public/group/public-group-list-item.dto";

export const toPublicGroupListItemDTO = (
  group: PublicGroupListItem,
): PublicGroupListItemDTO => ({
  id: group.id,
  title: group.title,
  description: group.description,
  groupAvatar: group.groupAvatar,
  visibility: group.visibility,
  status: group.status,
  memberCount: group.memberCount,
  createdAt: group.createdAt,
  updatedAt: group.updatedAt,
});