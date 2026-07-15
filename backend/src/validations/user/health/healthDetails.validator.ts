import { HealthDetailsRequestDto } from "../../../dtos/user/health/health-details.request.dto";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { GoalType } from "../../../types/health.types";

const GOALS_REQUIRING_TARGET_WEIGHT: GoalType[] = [
  "fitness_weight_loss",
  "fitness_weight_gain",
];

export class HealthDetailsValidator {
  static validate(dto: HealthDetailsRequestDto): void {
    if (dto.heightCm <= 0) {
      throw new CustomError(
        "Height must be greater than 0",
        StatusCode.BAD_REQUEST,
      );
    }

    if (dto.weightKg <= 0) {
      throw new CustomError(
        "Weight must be greater than 0",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      GOALS_REQUIRING_TARGET_WEIGHT.includes(dto.goal) &&
      !dto.targetWeightKg
    ) {
      throw new CustomError(
        "Target weight is required",
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
