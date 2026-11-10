import { CustomError } from "./customError";
import { StatusCode } from "../enums/statusCode.enum";

export const parseArrayField = (value: unknown, field: string): string[] => {
  if (Array.isArray(value)) {
    if (value.every((item): item is string => typeof item === "string")) {
      return value;
    }

    throw new CustomError(`Invalid ${field} format`, StatusCode.BAD_REQUEST);
  }

  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      Array.isArray(parsed) &&
      parsed.every((item): item is string => typeof item === "string")
    ) {
      return parsed;
    }
  } catch {
    throw new CustomError(`Invalid ${field} format`, StatusCode.BAD_REQUEST);
  }

  throw new CustomError(`Invalid ${field} format`, StatusCode.BAD_REQUEST);
};
