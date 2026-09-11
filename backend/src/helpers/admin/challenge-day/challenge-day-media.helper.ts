import { Types } from "mongoose";

import { CreateChallengeActivityDTO } from "../../../dtos/admin/challenge-day/create-challenge-activity.dto";
import { validateDto } from "../../../middlewares/validateDto.middleware";

import { IChallengeActivity } from "../../../models/challengeDay.model";

import {
  ActivityMediaFiles,
  ActivityMediaIndex,
  ChallengeDayUploadedFiles,
} from "../../../types/admin/challenge-day/challenge-day-files.types";

import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../../utils/cloudinaryUploads.util";

const IMAGE_FOLDER = "nutriwise/challenges/activity-images";

const VIDEO_FOLDER = "nutriwise/challenges/activity-videos";

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

interface UploadedActivityMedia {
  imageUrl?: string;
  imagePublicId?: string;
  videoUrl?: string;
  videoPublicId?: string;
  uploadedMedia: UploadedMedia[];
}

export const parseActivities = (value: unknown): unknown[] => {
  if (typeof value !== "string") {
    throw new CustomError("Activities are required", StatusCode.BAD_REQUEST);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new CustomError("Invalid activities data", StatusCode.BAD_REQUEST);
  }

  if (!Array.isArray(parsed)) {
    throw new CustomError(
      "Activities must be an array",
      StatusCode.BAD_REQUEST,
    );
  }

  if (parsed.length === 0) {
    throw new CustomError(
      "At least one activity is required",
      StatusCode.BAD_REQUEST,
    );
  }

  return parsed;
};

export const parseMediaIndexes = (value: unknown): ActivityMediaIndex[] => {
  if (value === undefined) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values.map((item) => {
    if (typeof item !== "string") {
      throw new CustomError(
        "Invalid activity media mapping",
        StatusCode.BAD_REQUEST,
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(item);
    } catch {
      throw new CustomError(
        "Invalid activity media mapping",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!parsed || typeof parsed !== "object") {
      throw new CustomError(
        "Invalid activity media mapping",
        StatusCode.BAD_REQUEST,
      );
    }

    const mapping = parsed as Partial<ActivityMediaIndex>;

    if (
      typeof mapping.index !== "number" ||
      !Number.isInteger(mapping.index) ||
      mapping.index < 0 ||
      typeof mapping.hasImage !== "boolean" ||
      typeof mapping.hasVideo !== "boolean"
    ) {
      throw new CustomError(
        "Invalid activity media mapping",
        StatusCode.BAD_REQUEST,
      );
    }

    return {
      index: mapping.index,
      hasImage: mapping.hasImage,
      hasVideo: mapping.hasVideo,
    };
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

const validateMediaMappings = (
  mediaIndexes: ActivityMediaIndex[],
  activityCount: number,
  files: ChallengeDayUploadedFiles,
): void => {
  if (mediaIndexes.length !== activityCount) {
    throw new CustomError(
      "Activity media mappings do not match the number of activities",
      StatusCode.BAD_REQUEST,
    );
  }

  const seenIndexes = new Set<number>();

  for (const mapping of mediaIndexes) {
    if (mapping.index >= activityCount) {
      throw new CustomError(
        `Invalid activity media index: ${mapping.index}`,
        StatusCode.BAD_REQUEST,
      );
    }

    if (seenIndexes.has(mapping.index)) {
      throw new CustomError(
        `Duplicate activity media mapping for activity ${mapping.index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    seenIndexes.add(mapping.index);
  }

  for (let index = 0; index < activityCount; index += 1) {
    if (!seenIndexes.has(index)) {
      throw new CustomError(
        `Missing activity media mapping for activity ${index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }
  }

  const expectedImageCount = mediaIndexes.filter(
    (mapping) => mapping.hasImage,
  ).length;

  const expectedVideoCount = mediaIndexes.filter(
    (mapping) => mapping.hasVideo,
  ).length;

  const actualImageCount = files.activityImages?.length ?? 0;

  const actualVideoCount = files.activityVideos?.length ?? 0;

  if (expectedImageCount !== actualImageCount) {
    throw new CustomError(
      "Uploaded image files do not match activity media mappings",
      StatusCode.BAD_REQUEST,
    );
  }

  if (expectedVideoCount !== actualVideoCount) {
    throw new CustomError(
      "Uploaded video files do not match activity media mappings",
      StatusCode.BAD_REQUEST,
    );
  }
};

const getActivityMedia = (
  activityIndex: number,
  mediaIndexes: ActivityMediaIndex[],
  files: ChallengeDayUploadedFiles,
): ActivityMediaFiles => {
  const mapping = mediaIndexes.find((item) => item.index === activityIndex);

  if (!mapping) {
    throw new CustomError(
      `Missing activity media mapping for activity ${activityIndex + 1}`,
      StatusCode.BAD_REQUEST,
    );
  }

  const imageMappings = mediaIndexes
    .filter((item) => item.hasImage)
    .sort((a, b) => a.index - b.index);

  const videoMappings = mediaIndexes
    .filter((item) => item.hasVideo)
    .sort((a, b) => a.index - b.index);

  const media: ActivityMediaFiles = {};

  if (mapping.hasImage) {
    const imagePosition = imageMappings.findIndex(
      (item) => item.index === activityIndex,
    );

    const image = files.activityImages?.[imagePosition];

    if (!image) {
      throw new CustomError(
        `Image file is missing for activity ${activityIndex + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateImageFile(image);

    media.image = image;
  }

  if (mapping.hasVideo) {
    const videoPosition = videoMappings.findIndex(
      (item) => item.index === activityIndex,
    );

    const video = files.activityVideos?.[videoPosition];

    if (!video) {
      throw new CustomError(
        `Video file is missing for activity ${activityIndex + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateVideoFile(video);

    media.video = video;
  }

  return media;
};

const cleanupUploadedMediaInternal = async (
  uploadedMedia: UploadedMedia[],
): Promise<void> => {
  if (uploadedMedia.length === 0) {
    return;
  }

  await Promise.allSettled(
    uploadedMedia.map(({ publicId, resourceType }) =>
      deleteFromCloudinary(publicId, resourceType),
    ),
  );
};

const uploadActivityMedia = async (
  media: ActivityMediaFiles,
): Promise<UploadedActivityMedia> => {
  const results = await Promise.allSettled([
    media.image
      ? uploadToCloudinary(media.image, IMAGE_FOLDER)
      : Promise.resolve(undefined),

    media.video
      ? uploadToCloudinary(media.video, VIDEO_FOLDER)
      : Promise.resolve(undefined),
  ]);

  const imageResult =
    results[0].status === "fulfilled" ? results[0].value : undefined;

  const videoResult =
    results[1].status === "fulfilled" ? results[1].value : undefined;

  const uploadedMedia: UploadedMedia[] = [];

  if (imageResult) {
    uploadedMedia.push({
      publicId: imageResult.publicId,
      resourceType: "image",
    });
  }

  if (videoResult) {
    uploadedMedia.push({
      publicId: videoResult.publicId,
      resourceType: "video",
    });
  }

  const hasUploadFailure = results.some(
    (result) => result.status === "rejected",
  );

  if (hasUploadFailure) {
    await cleanupUploadedMediaInternal(uploadedMedia);

    throw new CustomError(
      "Failed to upload activity media",
      StatusCode.INTERNAL_SERVER_ERROR,
    );
  }

  return {
    imageUrl: imageResult?.secureUrl,

    imagePublicId: imageResult?.publicId,

    videoUrl: videoResult?.secureUrl,

    videoPublicId: videoResult?.publicId,

    uploadedMedia,
  };
};

export const buildActivities = async (
  rawActivities: unknown[],
  mediaIndexes: ActivityMediaIndex[],
  files?: ChallengeDayUploadedFiles,
): Promise<IChallengeActivity[]> => {
  const uploadFiles: ChallengeDayUploadedFiles = {
    activityImages: files?.activityImages ?? [],
    activityVideos: files?.activityVideos ?? [],
  };

  validateMediaMappings(mediaIndexes, rawActivities.length, uploadFiles);

  const uploadedMedia: UploadedMedia[] = [];

  try {
    const preparedActivities = await Promise.all(
      rawActivities.map(async (rawActivity, index) => {
        const activity = await validateDto(
          CreateChallengeActivityDTO,
          rawActivity,
        );

        return {
          index,
          activity,
          media: getActivityMedia(index, mediaIndexes, uploadFiles),
        };
      }),
    );

    const results = await Promise.all(
      preparedActivities.map(async ({ index, activity, media }) => {
        const uploaded = await uploadActivityMedia(media);

        return {
          index,
          activity,
          uploaded,
        };
      }),
    );

    for (const result of results) {
      uploadedMedia.push(...result.uploaded.uploadedMedia);
    }

    return results
      .sort((a, b) => a.index - b.index)
      .map(({ index, activity, uploaded }) => ({
        _id: new Types.ObjectId(),

        type: activity.type,

        title: activity.title.trim(),

        description: activity.description?.trim(),

        instructions: activity.instructions?.trim(),

        valueType: activity.valueType,

        targetValue: activity.targetValue,

        unit: activity.unit?.trim(),

        estimatedDurationMinutes: activity.estimatedDurationMinutes,

        imageUrl: uploaded.imageUrl,

        imagePublicId: uploaded.imagePublicId,

        videoUrl: uploaded.videoUrl,

        videoPublicId: uploaded.videoPublicId,

        isRequired: activity.isRequired,

        order: index,

        configuration: activity.configuration ?? {},
      }));
  } catch (error) {
    await cleanupUploadedMediaInternal(uploadedMedia);

    throw error;
  }
};

export const cleanupUploadedMedia = async (
  uploadedMedia: UploadedMedia[],
): Promise<void> => {
  await cleanupUploadedMediaInternal(uploadedMedia);
};

export const getActivityMediaIds = (
  activities: IChallengeActivity[],
): UploadedMedia[] => {
  const media: UploadedMedia[] = [];

  for (const activity of activities) {
    if (activity.imagePublicId) {
      media.push({
        publicId: activity.imagePublicId,
        resourceType: "image",
      });
    }

    if (activity.videoPublicId) {
      media.push({
        publicId: activity.videoPublicId,
        resourceType: "video",
      });
    }
  }

  return media;
};

export const deleteChallengeDayMedia = async (
  activities: IChallengeActivity[],
): Promise<void> => {
  const media = getActivityMediaIds(activities);

  await cleanupUploadedMediaInternal(media);
};
