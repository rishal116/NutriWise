import { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";
import { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";

export const toAdminChallengeCardDTO = (
  challenge: AdminChallengeListItem,
): AdminChallengeCardDTO => {
  return {
    id: challenge.id.toString(),
    title: challenge.title,
    description: challenge.description,
    thumbnailUrl: challenge.thumbnailUrl,
    category: challenge.category,
    difficulty: challenge.difficulty,
    type: challenge.type,
    accessType: challenge.accessType,
    durationDays: challenge.durationDays,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    status: challenge.status,
    rewardPoints: challenge.rewardPoints ?? 0,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
};
