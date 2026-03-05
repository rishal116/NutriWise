import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";
import { HealthDetailsRequestDTO } from "../../dtos/user/healthDetails.dto";

export class HealthDetailsValidator {
  static validate(userId: string, payload: HealthDetailsRequestDTO): void {
    if (!userId) {
      throw new CustomError(
        "User ID is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.heightCm || payload.heightCm <= 0) {
      throw new CustomError(
        "Valid heightCm is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.weightKg || payload.weightKg <= 0) {
      throw new CustomError(
        "Valid weightKg is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.activityLevel) {
      throw new CustomError(
        "Activity level is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.dietType) {
      throw new CustomError(
        "Diet type is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.goal) {
      throw new CustomError(
        "Goal is required",
        StatusCode.BAD_REQUEST
      );
    }

    if (!payload.preferredTimeline) {
      throw new CustomError(
        "Preferred timeline is required",
        StatusCode.BAD_REQUEST
      );
    }
  }

  static calculateBMI(heightCm: number, weightKg: number): number {
    const bmi = weightKg / Math.pow(heightCm / 100, 2);

    if (!Number.isFinite(bmi)) {
      throw new CustomError(
        "Unable to calculate BMI",
        StatusCode.BAD_REQUEST
      );
    }

    return Number(bmi.toFixed(2));
  }
}