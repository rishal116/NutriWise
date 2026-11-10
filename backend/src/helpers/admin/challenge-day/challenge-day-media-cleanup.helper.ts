import type { IChallengeActivity } from "../../../models/challengeDay.model";
import {
  UploadedMedia,
  ExistingActivityMedia,
} from "../../../types/admin/challenge-day/challenge-day-media.types";

import type { ICloudinaryService } from "../../../services/interfaces/common/ICloudinaryService";

import logger from "../../../utils/logger";

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

export const cleanupUploadedMedia = async (
  media: UploadedMedia[],
  cloudinaryService: ICloudinaryService,
): Promise<void> => {
  await cleanupUploadedMediaInternal(media, cloudinaryService);
};

export const getActivityMediaIds = (
  activities: ExistingActivityMedia[],
): UploadedMedia[] =>
  activities.flatMap((activity) => [
    ...(activity.imagePublicId
      ? [
          {
            publicId: activity.imagePublicId,
            resourceType: "image" as const,
          },
        ]
      : []),
    ...(activity.videoPublicId
      ? [
          {
            publicId: activity.videoPublicId,
            resourceType: "video" as const,
          },
        ]
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
