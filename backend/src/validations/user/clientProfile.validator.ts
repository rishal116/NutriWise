import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
} from "../../dtos/user/clientProfile.dto";

import { CustomError } from "../../utils/customError";
import { StatusCode } from "../../enums/statusCode.enum";

export class ClientProfileValidator {
  static validateCreate(userId: string, payload: CreateClientProfileDTO): void {
    if (!userId) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    if (!payload.heightCm || payload.heightCm < 40) {
      throw new CustomError("Valid height is required", StatusCode.BAD_REQUEST);
    }

    if (!payload.weightKg || payload.weightKg < 10) {
      throw new CustomError("Valid weight is required", StatusCode.BAD_REQUEST);
    }

    if (
      !payload.dailyWaterIntakeLiters ||
      payload.dailyWaterIntakeLiters <= 0
    ) {
      throw new CustomError(
        "Daily water intake is required",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!payload.sleepDurationHours || payload.sleepDurationHours <= 0) {
      throw new CustomError(
        "Sleep duration is required",
        StatusCode.BAD_REQUEST,
      );
    }

    if (
      payload.preferredTimeline === "custom" &&
      !payload.customTimelineWeeks
    ) {
      throw new CustomError(
        "Custom timeline weeks required",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  static validateUpdate(userId: string, payload: UpdateClientProfileDTO): void {
    if (!userId) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    if (payload.heightCm !== undefined && payload.heightCm < 40) {
      throw new CustomError("Height must be valid", StatusCode.BAD_REQUEST);
    }

    if (payload.weightKg !== undefined && payload.weightKg < 10) {
      throw new CustomError("Weight must be valid", StatusCode.BAD_REQUEST);
    }

    if (
      payload.preferredTimeline === "custom" &&
      !payload.customTimelineWeeks
    ) {
      throw new CustomError(
        "Custom timeline weeks required",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  static calculateBMI(heightCm: number, weightKg: number): number {
    const heightM = heightCm / 100;

    return Number((weightKg / (heightM * heightM)).toFixed(2));
  }

  static calculateProfileCompletion(
    payload: Partial<CreateClientProfileDTO>,
  ): number {
    const totalFields = 12;

    let completedFields = 0;

    if (payload.dateOfBirth) completedFields++;
    if (payload.gender) completedFields++;
    if (payload.heightCm) completedFields++;
    if (payload.weightKg) completedFields++;
    if (payload.activityLevel) completedFields++;
    if (payload.fitnessLevel) completedFields++;
    if (payload.dietType) completedFields++;
    if (payload.goal) completedFields++;
    if (payload.preferredTimeline) completedFields++;
    if (payload.dailyWaterIntakeLiters) completedFields++;
    if (payload.sleepDurationHours) completedFields++;
    if (payload.profileCompleted) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }
}
