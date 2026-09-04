import { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";
import { AdminChallengeDetailsResult } from "../../../types/admin/challenge/admin-challenge-details-result.type";

export const toAdminChallengeDetailsDTO = (
  challenge: AdminChallengeDetailsResult,
): AdminChallengeDetailsDTO => {
  return {
    id: challenge._id,
    title: challenge.title,
    description: challenge.description,
    instructions: challenge.instructions,
    thumbnailUrl: challenge.thumbnailUrl,
    category: challenge.category,
    difficulty: challenge.difficulty,
    type: challenge.type,
    accessType: challenge.accessType,
    valueType: challenge.valueType,
    durationDays: challenge.durationDays,
    targetValue: challenge.targetValue,
    targetUnit: challenge.targetUnit,
    targetCount: challenge.targetCount,
    startDate: challenge.startDate,
    endDate: challenge.endDate,
    rewardPoints: challenge.rewardPoints ?? 0,
    badgeId: challenge.badgeId,
    status: challenge.status,
    createdBy: challenge.createdBy,
    createdAt: challenge.createdAt,
    updatedAt: challenge.updatedAt,
  };
};
