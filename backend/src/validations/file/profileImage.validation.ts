import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";

export const validateProfileImage = (
  file?: Express.Multer.File,
): void => {
  if (!file) {
    throw new CustomError(
      "Profile image is required",
      StatusCode.BAD_REQUEST,
    );
  }

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new CustomError(
      "Only JPEG, PNG and WebP images are allowed",
      StatusCode.BAD_REQUEST,
    );
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new CustomError(
      "Image size must not exceed 5 MB",
      StatusCode.BAD_REQUEST,
    );
  }
};