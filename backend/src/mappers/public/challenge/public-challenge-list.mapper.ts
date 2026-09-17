import { PublicChallengeCardDTO } from "../../../dtos/public/challenge/public-challenge-card.dto";

import { PublicChallengeListItem } from "../../../types/public/challenge/public-challenge-list-item.type";

export const toPublicChallengeCardDTO = (
  challenge: PublicChallengeListItem,
): PublicChallengeCardDTO => {
  return new PublicChallengeCardDTO({
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    thumbnailUrl: challenge.thumbnailUrl,
    category: challenge.category,
    difficulty: challenge.difficulty,
    accessType: challenge.accessType,
    durationDays: challenge.durationDays,
  });
};