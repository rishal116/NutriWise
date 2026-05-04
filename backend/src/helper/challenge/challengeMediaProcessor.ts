import {
  CreateChallengeDTO,
  ChallengeUploadFiles,
  IChallengeMedia,
} from "../../dtos/challenge/createChallenge.dto";

import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
} from "../../utils/cloudinaryUploads";

import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";
import logger from "../../utils/logger";

export const uploadHeroMedia = async (
  dto: CreateChallengeDTO,
  files: ChallengeUploadFiles,
  adminId: string,
): Promise<void> => {
  try {
    if (files.coverImage?.[0]) {
      dto.coverImage = await uploadToCloudinary(
        files.coverImage[0],
        "challenges/cover-images",
      );
    }

    if (files.bannerImage?.[0]) {
      dto.bannerImage = await uploadToCloudinary(
        files.bannerImage[0],
        "challenges/banner-images",
      );
    }

    if (files.introVideo?.[0]) {
      dto.introVideo = await uploadToCloudinary(
        files.introVideo[0],
        "challenges/intro-videos",
      );
    }
  } catch (err) {
    logger.error("Hero media upload failed", {
      adminId,
      error: (err as Error).message,
      action: "HERO_MEDIA_UPLOAD_FAILED",
    });

    throw new CustomError(
      "Failed to upload challenge media",
      StatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};

export const processChallengeMedia = async (
  dto: CreateChallengeDTO,
  files: ChallengeUploadFiles,
  adminId: string,
): Promise<IChallengeMedia[]> => {
  const parsedMedia: IChallengeMedia[] = Array.isArray(dto.media)
    ? dto.media
    : [];

  if (!parsedMedia.length) return [];

  if (!files.mediaFiles?.length) {
    throw new CustomError(
      "Media files are required when media metadata is provided",
      StatusCode.BAD_REQUEST,
    );
  }

  try {
    const uploadedMediaUrls = await uploadMultipleToCloudinary(
      files.mediaFiles,
      "challenges/media-gallery",
    );

    const finalMedia = parsedMedia.map((media, index) => ({
      ...media,
      url: uploadedMediaUrls[index] || "",
    }));

    if (finalMedia.some((item) => !item.url)) {
      throw new CustomError(
        "Media upload failed for one or more files",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return finalMedia;
  } catch (err) {
    logger.error("Media gallery upload failed", {
      adminId,
      error: (err as Error).message,
      action: "MEDIA_GALLERY_UPLOAD_FAILED",
    });

    throw new CustomError(
      "Failed to upload challenge gallery media",
      StatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};
