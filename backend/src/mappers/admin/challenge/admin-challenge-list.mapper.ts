import { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";

import { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";

export const toAdminChallengeCardDTO = (
  challenge: AdminChallengeListItem,
): AdminChallengeCardDTO => {
  return {
    id: challenge.id,

    title: challenge.title,
    description: challenge.description,

    thumbnailUrl: challenge.thumbnailUrl,

    category: challenge.category,
    difficulty: challenge.difficulty,
    accessType: challenge.accessType,

    durationDays: challenge.durationDays,

    status: challenge.status,

    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
};
