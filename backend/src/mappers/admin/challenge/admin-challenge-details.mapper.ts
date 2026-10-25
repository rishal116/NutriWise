import type { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";
import type { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

export const toAdminChallengeDetailsDTO = (
  challenge: AdminChallengeDetailsResult,
): AdminChallengeDetailsDTO => ({
  id: challenge.id,
  title: challenge.title,
  description: challenge.description,
  instructions: challenge.instructions,
  thumbnailUrl: challenge.thumbnailUrl,
  category: challenge.category,
  difficulty: challenge.difficulty,
  accessType: challenge.accessType,
  durationDays: challenge.durationDays,
  status: challenge.status,
});