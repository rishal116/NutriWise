import { GroupCardDTO } from "../../../dtos/nutritionist/group/group-card.dto";

import type { NutritionistGroupListItem } from "../../../types/nutritionist/group/nutritionist-group-list-item.type";

export const toGroupCardDTO = (
  group: NutritionistGroupListItem,
): GroupCardDTO => {
  return new GroupCardDTO({
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
};
