import { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";

import { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

export const toAdminChallengeDetailsDTO = (
  challenge: AdminChallengeDetailsResult,
): AdminChallengeDetailsDTO => {
  return {
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

    createdBy: challenge.createdBy,

    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
};