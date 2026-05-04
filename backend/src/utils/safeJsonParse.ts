import { CustomError } from "../utils/customError";
import { StatusCode } from "../enums/statusCode.enum";

export const safeJsonParse = <T>(
  value: unknown,
  fallback: T,
  errorMessage: string,
): T => {
  if (!value) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value as T;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    throw new CustomError(errorMessage, StatusCode.BAD_REQUEST);
  }
};