import { GroupDetailsDTO } from "../../../dtos/nutritionist/group/group-details.dto";

import type { NutritionistGroupDetailsResult } from "../../../types/nutritionist/group/nutritionist-group-details-result.type";

export const toGroupDetailsDTO = (
  group: NutritionistGroupDetailsResult,
  inviteToken?: string,
): GroupDetailsDTO => {
  return new GroupDetailsDTO({
    id: group.id,
    title: group.title,
    description: group.description,
    groupAvatar: group.groupAvatar,
    visibility: group.visibility,
    status: group.status,
    memberCount: group.memberCount,
    inviteToken,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  });
};
