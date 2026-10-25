import type { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";
import type { AdminChallengeListItem } from "../../../types/admin/challenge/admin-challenge-list-item.type";

export const toAdminChallengeCardDTO = (
  challenge: AdminChallengeListItem,
): AdminChallengeCardDTO => ({
  id: challenge.id,
  title: challenge.title,
  thumbnailUrl: challenge.thumbnailUrl,
  category: challenge.category,
  difficulty: challenge.difficulty,
  accessType: challenge.accessType,
  durationDays: challenge.durationDays,
  status: challenge.status,
});