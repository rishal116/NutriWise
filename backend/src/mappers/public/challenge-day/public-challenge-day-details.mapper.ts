import { PublicChallengeDayDetailsDTO } from "../../../dtos/public/challenge-day/public-challenge-day-details.dto";

import { PublicChallengeDayResult } from "../../../types/public/challenge-day/public-challenge-day-result.type";

export const toPublicChallengeDayDetailsDTO = (
  day: PublicChallengeDayResult,
): PublicChallengeDayDetailsDTO => {
  return new PublicChallengeDayDetailsDTO({
    id: day.id,
    dayNumber: day.dayNumber,
    title: day.title,
    description: day.description,
    activities: day.activities,
  });
};