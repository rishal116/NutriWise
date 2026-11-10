import { Types } from "mongoose";

import type { IChallengeActivity } from "../../../models/challengeDay.model";

import type { ICloudinaryService } from "../../../services/interfaces/common/ICloudinaryService";

import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";
import logger from "../../../utils/logger";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export interface UploadedMedia {
  publicId: string;
  resourceType: "image" | "video";
}

interface ExistingActivityMedia {
  _id: Types.ObjectId;
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
}

export interface BuildActivitiesResult {
  activities: ExistingActivityMedia[];
  newlyUploadedMedia: UploadedMedia[];
}

const cleanupUploadedMediaInternal = async (
  media: UploadedMedia[],
  cloudinaryService: ICloudinaryService,
): Promise<void> => {
  if (media.length === 0) return;

  const results = await Promise.allSettled(
    media.map(({ publicId, resourceType }) =>
      cloudinaryService.delete(publicId, resourceType),
    ),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      logger.error("Failed to clean up uploaded activity media", {
        publicId: media[index].publicId,
        resourceType: media[index].resourceType,
        error: result.reason,
      });
    }
  });
};

export const validateImageFile = (file: Express.Multer.File): void => {
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    throw new CustomError(
      "Only JPG, PNG, and WEBP images are allowed",
      StatusCode.BAD_REQUEST,
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new CustomError(
      "Image must be 5MB or smaller",
      StatusCode.BAD_REQUEST,
    );
  }
};

export const validateVideoFile = (file: Express.Multer.File): void => {
  if (!ALLOWED_VIDEO_TYPES.has(file.mimetype)) {
    throw new CustomError(
      "Only MP4, WEBM, and MOV videos are allowed",
      StatusCode.BAD_REQUEST,
    );
  }

  if (file.size > MAX_VIDEO_SIZE) {
    throw new CustomError(
      "Video must be 50MB or smaller",
      StatusCode.BAD_REQUEST,
    );
  }
};

export const getActivityMediaIds = (
  activities: ExistingActivityMedia[],
): UploadedMedia[] =>
  activities.flatMap((activity) => [
    ...(activity.imagePublicId
      ? [{ publicId: activity.imagePublicId, resourceType: "image" as const }]
      : []),
    ...(activity.videoPublicId
      ? [{ publicId: activity.videoPublicId, resourceType: "video" as const }]
      : []),
  ]);

export const deleteChallengeDayMedia = async (
  activities: IChallengeActivity[],
  cloudinaryService: ICloudinaryService,
): Promise<void> => {
  await cleanupUploadedMediaInternal(
    getActivityMediaIds(activities),
    cloudinaryService,
  );
};
