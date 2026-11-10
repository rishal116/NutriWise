import { ActivityMediaIndex } from "../../../types/admin/challenge-day/challenge-day-media.types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

export const parseActivities = (value: unknown): unknown[] => {
  let parsed: unknown = value;

  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new CustomError("Invalid activities data", StatusCode.BAD_REQUEST);
    }
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
  if (value === undefined || value === null || value === "") {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values.map((item): ActivityMediaIndex => {
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

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
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
