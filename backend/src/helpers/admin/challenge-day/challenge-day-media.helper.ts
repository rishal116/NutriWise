import { Types } from "mongoose";

import { CreateChallengeActivityDTO } from "../../../dtos/admin/challenge-day/create-challenge-activity.dto";
import { UpdateChallengeActivityDTO } from "../../../dtos/admin/challenge-day/update-challenge-activity.dto";
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
}

const cleanupUploadedMediaInternal = async (
  media: UploadedMedia[],
): Promise<void> => {
  await Promise.allSettled(
    media.map(({ publicId, resourceType }) =>
      deleteFromCloudinary(publicId, resourceType),
    ),
  );
};

export const parseActivities = (value: unknown): unknown[] => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      throw new CustomError(
        "At least one activity is required",
        StatusCode.BAD_REQUEST,
      );
    }
    return value;
  }

  if (typeof value !== "string") {
    throw new CustomError("Activities are required", StatusCode.BAD_REQUEST);
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new CustomError("Invalid activities data", StatusCode.BAD_REQUEST);
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new CustomError(
      "At least one activity is required",
      StatusCode.BAD_REQUEST,
    );
  }

  return parsed;
};

export const parseMediaIndexes = (value: unknown): ActivityMediaIndex[] => {
  if (value === undefined || value === null || value === "") return [];

  const values = Array.isArray(value) ? value : [value];

  return values.map((item) => {
    let parsed: unknown = item;

    if (typeof item === "string") {
      try {
        parsed = JSON.parse(item);
      } catch {
        throw new CustomError(
          "Invalid activity media mapping",
          StatusCode.BAD_REQUEST,
        );
      }
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

const normalizeMediaMappings = (
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

const getActivityMedia = (
  index: number,
  mappings: ActivityMediaIndex[],
  files: ChallengeDayUploadedFiles,
): ActivityMediaFiles => {
  const mapping = mappings[index];
  const media: ActivityMediaFiles = {};

  if (mapping.hasImage) {
    const imageIndex = mappings
      .slice(0, index)
      .filter((item) => item.hasImage).length;

    const image = files.activityImages?.[imageIndex];

    if (!image) {
      throw new CustomError(
        `Image file is missing for activity ${index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateImageFile(image);
    media.image = image;
  }

  if (mapping.hasVideo) {
    const videoIndex = mappings
      .slice(0, index)
      .filter((item) => item.hasVideo).length;

    const video = files.activityVideos?.[videoIndex];

    if (!video) {
      throw new CustomError(
        `Video file is missing for activity ${index + 1}`,
        StatusCode.BAD_REQUEST,
      );
    }

    validateVideoFile(video);
    media.video = video;
  }

  return media;
};

const uploadActivityMedia = async (
  media: ActivityMediaFiles,
): Promise<{
  media: UploadedActivityMedia;
  uploadedMedia: UploadedMedia[];
}> => {
  const uploadedMedia: UploadedMedia[] = [];
  const result: UploadedActivityMedia = {};

  try {
    if (media.image) {
      const image = await uploadToCloudinary(media.image, IMAGE_FOLDER);

      result.imageUrl = image.secureUrl;
      result.imagePublicId = image.publicId;
      uploadedMedia.push({
        publicId: image.publicId,
        resourceType: "image",
      });
    }

    if (media.video) {
      const video = await uploadToCloudinary(media.video, VIDEO_FOLDER);

      result.videoUrl = video.secureUrl;
      result.videoPublicId = video.publicId;
      uploadedMedia.push({
        publicId: video.publicId,
        resourceType: "video",
      });
    }

    return { media: result, uploadedMedia };
  } catch {
    await cleanupUploadedMediaInternal(uploadedMedia);

    throw new CustomError(
      "Failed to upload activity media",
      StatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};

export interface BuildActivitiesResult {
  activities: IChallengeActivity[];
  newlyUploadedMedia: UploadedMedia[];
}

export const buildActivities = async (
  rawActivities: unknown[],
  mediaIndexes: ActivityMediaIndex[],
  files?: ChallengeDayUploadedFiles,
  existingActivities: IChallengeActivity[] = [],
  isUpdate: boolean = false,
): Promise<BuildActivitiesResult> => {
  const uploadFiles: ChallengeDayUploadedFiles = {
    activityImages: files?.activityImages ?? [],
    activityVideos: files?.activityVideos ?? [],
  };

  const mappings = normalizeMediaMappings(
    mediaIndexes,
    rawActivities.length,
    uploadFiles,
  );

  const newlyUploadedMedia: UploadedMedia[] = [];

  const existingById = new Map<string, IChallengeActivity>();
  for (const existing of existingActivities) {
    existingById.set(existing._id.toString(), existing);
  }
  const matchedExistingIds = new Set<string>();

  try {
    const activities: IChallengeActivity[] = [];

    for (let index = 0; index < rawActivities.length; index++) {
      const rawActivity = rawActivities[index];

      const activity = isUpdate
        ? await validateDto(UpdateChallengeActivityDTO, rawActivity)
        : await validateDto(CreateChallengeActivityDTO, rawActivity);

      const uploaded = await uploadActivityMedia(
        getActivityMedia(index, mappings, uploadFiles),
      );

      newlyUploadedMedia.push(...uploaded.uploadedMedia);

      const updateActivity = isUpdate
        ? (activity as UpdateChallengeActivityDTO)
        : undefined;
      const activityId =
        updateActivity?.id ??
        updateActivity?._id ??
        (rawActivity as { id?: string; _id?: string })?.id ??
        (rawActivity as { id?: string; _id?: string })?._id;

      let existing: IChallengeActivity | undefined;

      if (activityId && existingById.has(activityId)) {
        existing = existingById.get(activityId);
        if (existing) {
          matchedExistingIds.add(existing._id.toString());
        }
      } else if (!activityId && index < existingActivities.length) {
        const candidate = existingActivities[index];
        if (candidate && !matchedExistingIds.has(candidate._id.toString())) {
          existing = candidate;
          matchedExistingIds.add(candidate._id.toString());
        }
      }

      let imageUrl: string | undefined;
      let imagePublicId: string | undefined;

      if (uploaded.media.imageUrl) {
        imageUrl = uploaded.media.imageUrl;
        imagePublicId = uploaded.media.imagePublicId;
      } else if (updateActivity?.removeImage) {
        imageUrl = undefined;
        imagePublicId = undefined;
      } else {
        imageUrl = existing?.imageUrl;
        imagePublicId = existing?.imagePublicId;
      }

      let videoUrl: string | undefined;
      let videoPublicId: string | undefined;

      if (uploaded.media.videoUrl) {
        videoUrl = uploaded.media.videoUrl;
        videoPublicId = uploaded.media.videoPublicId;
      } else if (updateActivity?.removeVideo) {
        videoUrl = undefined;
        videoPublicId = undefined;
      } else {
        videoUrl = existing?.videoUrl;
        videoPublicId = existing?.videoPublicId;
      }

      let finalId: Types.ObjectId;
      if (existing) {
        finalId = existing._id;
      } else if (activityId && Types.ObjectId.isValid(activityId)) {
        finalId = new Types.ObjectId(activityId);
      } else {
        finalId = new Types.ObjectId();
      }

      activities.push({
        _id: finalId,
        type: activity.type,
        title: activity.title.trim(),
        description: activity.description?.trim(),
        instructions: activity.instructions?.trim(),
        valueType: activity.valueType,
        targetValue: activity.targetValue,
        unit: activity.unit?.trim(),
        estimatedDurationMinutes: activity.estimatedDurationMinutes,
        imageUrl,
        imagePublicId,
        videoUrl,
        videoPublicId,
        isRequired: activity.isRequired,
        order: activity.order ?? index,
      });
    }

    return { activities, newlyUploadedMedia };
  } catch (error) {
    await cleanupUploadedMediaInternal(newlyUploadedMedia);
    throw error;
  }
};

export const cleanupUploadedMedia = async (
  media: UploadedMedia[],
): Promise<void> => {
  await cleanupUploadedMediaInternal(media);
};

export const getActivityMediaIds = (
  activities: IChallengeActivity[],
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
): Promise<void> => {
  await cleanupUploadedMediaInternal(getActivityMediaIds(activities));
};
