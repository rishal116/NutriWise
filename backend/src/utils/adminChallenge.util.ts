import { Types } from "mongoose";

import { StatusCode } from "../enums/statusCode.enum";
import { CustomError } from "./customError";

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