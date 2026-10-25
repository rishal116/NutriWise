
import { Types } from "mongoose";

import { StatusCode } from "../enums/statusCode.enum";
import { CustomError } from "./customError";
import logger from "./logger";
import { deleteFromCloudinary } from "./cloudinaryUploads.util";

export function validateChallengeId(challengeId: string): void {
  if (!challengeId?.trim()) {
    throw new CustomError(
      "Challenge ID is required",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!Types.ObjectId.isValid(challengeId)) {
    throw new CustomError(
      "Invalid challenge ID",
      StatusCode.BAD_REQUEST,
    );
  }
}

export function getCloudinaryPublicId(
  imageUrl?: string,
): string | null {
  if (!imageUrl?.trim()) {
    return null;
  }

  try {
    const url = new URL(imageUrl);
    const uploadIndex = url.pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
      return null;
    }

    const segments = url.pathname
      .slice(uploadIndex + "/upload/".length)
      .split("/")
      .filter(Boolean);

    const versionIndex = segments.findIndex((segment) =>
      /^v\d+$/.test(segment),
    );

    const publicIdSegments =
      versionIndex >= 0
        ? segments.slice(versionIndex + 1)
        : segments;

    if (publicIdSegments.length === 0) {
      return null;
    }

    const lastIndex = publicIdSegments.length - 1;

    publicIdSegments[lastIndex] = publicIdSegments[lastIndex].replace(
      /\.[^/.]+$/,
      "",
    );

    return publicIdSegments.join("/") || null;
  } catch {
    logger.warn("Failed to extract Cloudinary public ID", {
      imageUrl,
    });

    return null;
  }
}

export async function deleteChallengeImage(
  imageUrl?: string,
): Promise<void> {
  const publicId = getCloudinaryPublicId(imageUrl);

  if (!publicId) {
    return;
  }

  try {
    await deleteFromCloudinary(publicId);
  } catch (error) {
    logger.warn("Failed to delete Cloudinary challenge image", {
      publicId,
      error,
    });
  }
}
