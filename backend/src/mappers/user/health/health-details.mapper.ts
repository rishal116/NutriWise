import { UpdateQuery } from "mongoose";
import { IHealthDetails } from "../../../models/healthDetails.model";
import { HealthDetailsRequestDto } from "../../../dtos/user/health/health-details.request.dto";
import { HealthDetailsResponseDto } from "../../../dtos/user/health/health-details.response.dto";

export class HealthDetailsMapper {
  static toPersistence(
    dto: HealthDetailsRequestDto,
  ): UpdateQuery<IHealthDetails> {
    return {
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      activityLevel: dto.activityLevel,
      dietType: dto.dietType,
      goal: dto.goal,
      targetWeightKg: dto.targetWeightKg,
      preferredTimeline: dto.preferredTimeline,
    };
  }

  static toResponseDto(
    healthDetails: IHealthDetails,
    bmi: number,
  ): HealthDetailsResponseDto {
    return {
      heightCm: healthDetails.heightCm,
      weightKg: healthDetails.weightKg,
      bmi,
      activityLevel: healthDetails.activityLevel,
      dietType: healthDetails.dietType,
      goal: healthDetails.goal,
      targetWeightKg: healthDetails.targetWeightKg,
      preferredTimeline: healthDetails.preferredTimeline,
    };
  }
}