import {
  CreateChallengeDTO,
  IChallengeMedia,
} from "../../dtos/challenge/challenge.dto";
import { safeJsonParse } from "../../utils/safeJsonParse";

interface RawChallengeDTO extends Omit<CreateChallengeDTO, "duration" | "isPremium" | "isFeatured" | "isTrending" | "isRecommended" | "estimatedCaloriesBurn" | "tags" | "benefits" | "equipmentNeeded" | "media"> {
  duration: string | number;
  isPremium?: string | boolean;
  isFeatured?: string | boolean;
  isTrending?: string | boolean;
  isRecommended?: string | boolean;
  estimatedCaloriesBurn?: string | number;
  tags?: string | string[];
  benefits?: string | string[];
  equipmentNeeded?: string | string[];
  media?: string | IChallengeMedia[];
  mediaMetadata?: string;
}

export const normalizeChallengeDto = (dto: CreateChallengeDTO): void => {
  const raw = dto as unknown as RawChallengeDTO;

  dto.duration = Number(raw.duration);

  if (raw.estimatedCaloriesBurn) {
    dto.estimatedCaloriesBurn = Number(raw.estimatedCaloriesBurn);
  }

  // Handle media either from direct media field or mediaMetadata
  const mediaSource = raw.mediaMetadata || raw.media;
  dto.media = safeJsonParse<IChallengeMedia[]>(
    mediaSource,
    [],
    "Invalid media metadata format",
  );

  dto.tags = safeJsonParse<string[]>(
    raw.tags,
    [],
    "Invalid tags format",
  ).filter((tag) => tag.trim() !== "");

  dto.benefits = safeJsonParse<string[]>(
    raw.benefits,
    [],
    "Invalid benefits format",
  ).filter((benefit) => benefit.trim() !== "");

  dto.equipmentNeeded = safeJsonParse<string[]>(
    raw.equipmentNeeded,
    [],
    "Invalid equipment needed format",
  ).filter((equipment) => equipment.trim() !== "");

  dto.isPremium = raw.isPremium === true || raw.isPremium === "true";
  dto.isFeatured = raw.isFeatured === true || raw.isFeatured === "true";
  dto.isTrending = raw.isTrending === true || raw.isTrending === "true";
  dto.isRecommended = raw.isRecommended === true || raw.isRecommended === "true";
};

