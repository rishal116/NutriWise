import {
  CreateChallengeDTO,
  IChallengeMedia,
  IChallengeReward,
} from "../../dtos/challenge/createChallenge.dto";
import { safeJsonParse } from "../../utils/safeJsonParse";

export const normalizeChallengeDto = (dto: CreateChallengeDTO): void => {
  dto.duration = Number(dto.duration);

  dto.media = safeJsonParse<IChallengeMedia[]>(
    dto.mediaMetadata,
    [],
    "Invalid media metadata format",
  );

  dto.rewards = safeJsonParse<IChallengeReward>(
    dto.rewards,
    {
      xpPoints: 0,
      certificate: false,
      premiumUnlock: false,
    },
    "Invalid rewards format",
  );

  dto.tags = safeJsonParse<string[]>(
    dto.tags,
    [],
    "Invalid tags format",
  ).filter((tag) => tag.trim() !== "");

  dto.benefits = safeJsonParse<string[]>(
    dto.benefits,
    [],
    "Invalid benefits format",
  ).filter((benefit) => benefit.trim() !== "");

  dto.equipmentNeeded = safeJsonParse<string[]>(
    dto.equipmentNeeded,
    [],
    "Invalid equipment needed format",
  ).filter((equipment) => equipment.trim() !== "");

  dto.isPremium = dto.isPremium === true || dto.isPremium === "true";
  dto.isFeatured = dto.isFeatured === true || dto.isFeatured === "true";
  dto.isTrending = dto.isTrending === true || dto.isTrending === "true";
  dto.isRecommended =
    dto.isRecommended === true || dto.isRecommended === "true";
};