import {
  ActivityMediaFiles,
  ActivityMediaIndex,
  ChallengeDayUploadedFiles,
} from "../../../types/admin/challenge-day/challenge-day-media.types";

import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

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

export const normalizeMediaMappings = (
  mappings: ActivityMediaIndex[],
  activityCount: number,
  files: ChallengeDayUploadedFiles,
): ActivityMediaIndex[] => {
  const mappingsByIndex = new Map<number, ActivityMediaIndex>();

  for (const mapping of mappings) {
    if (mapping.index >= activityCount) {
      throw new CustomError(
        `Invalid activity media index: ${mapping.index}`,
        StatusCode.BAD_REQUEST,
      );
    }

    if (mappingsByIndex.has(mapping.index)) {
      throw new CustomError(
        `Duplicate activity media mapping for activity ${mapping.index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    mappingsByIndex.set(mapping.index, mapping);
  }

  const normalized = Array.from({ length: activityCount }, (_, index) => ({
    index,
    hasImage: mappingsByIndex.get(index)?.hasImage ?? false,
    hasVideo: mappingsByIndex.get(index)?.hasVideo ?? false,
  }));

  const expectedImages = normalized.filter((item) => item.hasImage).length;

  const expectedVideos = normalized.filter((item) => item.hasVideo).length;

  if (expectedImages !== (files.activityImages?.length ?? 0)) {
    throw new CustomError(
      "Uploaded image files do not match activity media mappings",
      StatusCode.BAD_REQUEST,
    );
  }

  if (expectedVideos !== (files.activityVideos?.length ?? 0)) {
    throw new CustomError(
      "Uploaded video files do not match activity media mappings",
      StatusCode.BAD_REQUEST,
    );
  }

  return normalized;
};

export const getActivityMedia = (
  mapping: ActivityMediaIndex,
  image: Express.Multer.File | undefined,
  video: Express.Multer.File | undefined,
): ActivityMediaFiles => {
  const media: ActivityMediaFiles = {};

  if (mapping.hasImage) {
    if (!image) {
      throw new CustomError(
        `Image file is missing for activity ${mapping.index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateImageFile(image);
    media.image = image;
  }

  if (mapping.hasVideo) {
    if (!video) {
      throw new CustomError(
        `Video file is missing for activity ${mapping.index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateVideoFile(video);
    media.video = video;
  }

  return media;
};

export const getActivityFileIndexes = (
  mappings: ActivityMediaIndex[],
): {
  imageIndexes: number[];
  videoIndexes: number[];
} => {
  const imageIndexes: number[] = [];
  const videoIndexes: number[] = [];

  mappings.forEach((mapping, index) => {
    if (mapping.hasImage) imageIndexes.push(index);
    if (mapping.hasVideo) videoIndexes.push(index);
  });

  return { imageIndexes, videoIndexes };
};
