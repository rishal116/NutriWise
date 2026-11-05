import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateProfileImage = (
  file?: Express.Multer.File,
): void => {
  if (!file) {
    throw new CustomError(
      "Profile image is required",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw new CustomError(
      "Only JPEG, PNG and WebP images are allowed",
      StatusCode.BAD_REQUEST,
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new CustomError(
      "Image size must not exceed 5 MB",
      StatusCode.BAD_REQUEST,
    );
  }
};