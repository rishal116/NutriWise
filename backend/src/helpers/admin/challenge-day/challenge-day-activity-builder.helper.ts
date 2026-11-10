import { Types } from "mongoose";

import { CreateChallengeActivityDTO } from "../../../dtos/admin/challenge-day/create-challenge-activity.dto";
import { UpdateChallengeActivityDTO } from "../../../dtos/admin/challenge-day/update-challenge-activity.dto";

import { validateDto } from "../../../middlewares/validateDto.middleware";

import type { IChallengeActivity } from "../../../models/challengeDay.model";

import type {
  ActivityMediaFiles,
  ActivityMediaIndex,
  BuildActivitiesResult,
  ChallengeDayUploadedFiles,
  ExistingActivityMedia,
  UploadedActivityMedia,
  UploadedMedia,
} from "../../../types/admin/challenge-day/challenge-day-media.types";

import type { ICloudinaryService } from "../../../services/interfaces/common/ICloudinaryService";

import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

import { cleanupUploadedMedia } from "./challenge-day-media-cleanup.helper";

import {
  getActivityFileIndexes,
  getActivityMedia,
  normalizeMediaMappings,
} from "./challenge-day-media-validation.helper";

const IMAGE_FOLDER = "nutriwise/challenges/activity-images";
const VIDEO_FOLDER = "nutriwise/challenges/activity-videos";

const getActivityId = (activity: unknown): string | undefined => {
  if (!activity || typeof activity !== "object") return undefined;

  const value = activity as { id?: unknown; _id?: unknown };
  const id = value.id ?? value._id;

  return typeof id === "string" ? id : undefined;
};

const uploadActivityMedia = async (
  media: ActivityMediaFiles,
  cloudinaryService: ICloudinaryService,
): Promise<{
  media: UploadedActivityMedia;
  uploadedMedia: UploadedMedia[];
}> => {
  const uploadedMedia: UploadedMedia[] = [];
  const result: UploadedActivityMedia = {};

  try {
    if (media.image) {
      const image = await cloudinaryService.upload(media.image, IMAGE_FOLDER);

      result.imageUrl = image.secureUrl;
      result.imagePublicId = image.publicId;

      uploadedMedia.push({
        publicId: image.publicId,
        resourceType: "image",
      });
    }

    if (media.video) {
      const video = await cloudinaryService.upload(media.video, VIDEO_FOLDER);

      result.videoUrl = video.secureUrl;
      result.videoPublicId = video.publicId;

      uploadedMedia.push({
        publicId: video.publicId,
        resourceType: "video",
      });
    }

    return { media: result, uploadedMedia };
  } catch (error) {
    await cleanupUploadedMedia(uploadedMedia, cloudinaryService);
    throw error;
  }
};

export const buildActivities = async (
  rawActivities: unknown[],
  mediaIndexes: ActivityMediaIndex[],
  files: ChallengeDayUploadedFiles | undefined,
  cloudinaryService: ICloudinaryService,
  existingActivities: ExistingActivityMedia[] = [],
  isUpdate = false,
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

  const { imageIndexes, videoIndexes } = getActivityFileIndexes(mappings);

  const existingById = new Map<string, ExistingActivityMedia>();

  for (const existing of existingActivities) {
    existingById.set(existing._id.toString(), existing);
  }

  const matchedExistingIds = new Set<string>();
  const suppliedIds = new Set<string>();
  const newlyUploadedMedia: UploadedMedia[] = [];

  try {
    const activities: IChallengeActivity[] = [];

    for (let index = 0; index < rawActivities.length; index++) {
      const rawActivity = rawActivities[index];

      const activity = isUpdate
        ? await validateDto(UpdateChallengeActivityDTO, rawActivity)
        : await validateDto(CreateChallengeActivityDTO, rawActivity);

      const activityId = isUpdate ? getActivityId(rawActivity) : undefined;

      let existing: ExistingActivityMedia | undefined;

      if (activityId) {
        if (!Types.ObjectId.isValid(activityId)) {
          throw new CustomError("Invalid activity ID", StatusCode.BAD_REQUEST);
        }

        if (suppliedIds.has(activityId)) {
          throw new CustomError(
            "Duplicate activity ID",
            StatusCode.BAD_REQUEST,
          );
        }

        suppliedIds.add(activityId);

        existing = existingById.get(activityId);

        if (!existing) {
          throw new CustomError(
            "Activity does not belong to this challenge day",
            StatusCode.BAD_REQUEST,
          );
        }

        matchedExistingIds.add(activityId);
      } else if (isUpdate && index < existingActivities.length) {
        const candidate = existingActivities[index];
        const candidateId = candidate?._id.toString();

        if (candidate && !matchedExistingIds.has(candidateId)) {
          existing = candidate;
          matchedExistingIds.add(candidateId);
        }
      }

      const imageIndex = imageIndexes.indexOf(index);
      const videoIndex = videoIndexes.indexOf(index);

      const media = getActivityMedia(
        mappings[index],
        imageIndex >= 0 ? uploadFiles.activityImages?.[imageIndex] : undefined,
        videoIndex >= 0 ? uploadFiles.activityVideos?.[videoIndex] : undefined,
      );

      const uploaded = await uploadActivityMedia(media, cloudinaryService);

      newlyUploadedMedia.push(...uploaded.uploadedMedia);

      const updateActivity = isUpdate
        ? (activity as UpdateChallengeActivityDTO)
        : undefined;

      const imageUrl =
        uploaded.media.imageUrl ??
        (updateActivity?.removeImage ? undefined : existing?.imageUrl);

      const imagePublicId =
        uploaded.media.imagePublicId ??
        (updateActivity?.removeImage ? undefined : existing?.imagePublicId);

      const videoUrl =
        uploaded.media.videoUrl ??
        (updateActivity?.removeVideo ? undefined : existing?.videoUrl);

      const videoPublicId =
        uploaded.media.videoPublicId ??
        (updateActivity?.removeVideo ? undefined : existing?.videoPublicId);

      activities.push({
        _id: existing?._id ?? new Types.ObjectId(),
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
    await cleanupUploadedMedia(newlyUploadedMedia, cloudinaryService);
    throw error;
  }
};
