import { CreateChallengeDTO } from "../../dtos/challenge/createChallenge.dto";
import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";

export const validateChallengeDto = (dto: CreateChallengeDTO): void => {
  if (!dto.title?.trim()) {
    throw new CustomError(
      "Challenge title is required",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!dto.duration || Number(dto.duration) < 1) {
    throw new CustomError(
      "Challenge duration must be at least 1 day",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!["easy", "medium", "hard"].includes(dto.difficulty)) {
    throw new CustomError(
      "Invalid difficulty level",
      StatusCode.BAD_REQUEST,
    );
  }

  if (!["fitness", "nutrition", "mental", "hybrid"].includes(dto.type)) {
    throw new CustomError(
      "Invalid challenge type",
      StatusCode.BAD_REQUEST,
    );
  }

  if (
    dto.category === "custom" &&
    (!dto.customCategory || !dto.customCategory.trim())
  ) {
    throw new CustomError(
      "Custom category name is required",
      StatusCode.BAD_REQUEST,
    );
  }
};