
import { Types } from "mongoose";

import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";

export function validateChallengeDayId(
  id: string,
  fieldName: string,
): void {
  if (!id?.trim()) {
    throw new CustomError(
      `${fieldName} is required`,
      StatusCode.BAD_REQUEST,
    );
  }

  if (!Types.ObjectId.isValid(id)) {
    throw new CustomError(
      `Invalid ${fieldName}`,
      StatusCode.BAD_REQUEST,
    );
  }
}

export function validateChallengeDayNumber(
  dayNumber: number,
  durationDays: number,
): void {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) {
    throw new CustomError(
      "Day number must be a positive integer",
      StatusCode.BAD_REQUEST,
    );
  }

  if (dayNumber > durationDays) {
    throw new CustomError(
      `Day number cannot be greater than the challenge duration of ${durationDays} days`,
      StatusCode.BAD_REQUEST,
    );
  }
}

export function validateChallengeDayOwnership(
  actualChallengeId: Types.ObjectId,
  expectedChallengeId: string,
): void {
  if (actualChallengeId.toString() !== expectedChallengeId) {
    throw new CustomError(
      "Challenge day does not belong to this challenge",
      StatusCode.BAD_REQUEST,
    );
  }
}
