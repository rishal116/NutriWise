import mongoose from "mongoose";
import { CreateChallengeDTO } from "../../dtos/challenge/challenge.dto";
import { IChallenge } from "../../models/challenge.model";

export const buildChallengeData = (
  dto: CreateChallengeDTO,
  slug: string,
  adminId: string,
): Partial<IChallenge> => {
  return {
    ...dto,

    duration: Number(dto.duration),

    tags: Array.isArray(dto.tags) ? dto.tags : [],

    benefits: Array.isArray(dto.benefits) ? dto.benefits : [],

    equipmentNeeded: Array.isArray(dto.equipmentNeeded)
      ? dto.equipmentNeeded
      : [],
    media: Array.isArray(dto.media) ? dto.media : [],

    isPremium: Boolean(dto.isPremium),
    isFeatured: Boolean(dto.isFeatured),
    isTrending: Boolean(dto.isTrending),
    isRecommended: Boolean(dto.isRecommended),

    slug,

    createdBy: new mongoose.Types.ObjectId(adminId),
  };
};