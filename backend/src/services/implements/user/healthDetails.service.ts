import { injectable, inject } from "inversify";
import { IHealthDetailsService } from "../../interfaces/user/account/IHealthDetailsService";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/account/IHealthDetailsRepository";
import { TYPES } from "../../../types/types";
import { HealthDetailsResponseDto } from "../../../dtos/user/health/health-details.response.dto";
import { HealthDetailsMapper } from "../../../mapper/user/health/health-details.mapper";
import { HealthDetailsValidator } from "../../../validations/user/health/healthDetails.validator";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IHealthProgressRepository } from "../../../repositories/interfaces/user/account/IHealthProgressRepository";
import { HealthDetailsRequestDto } from "../../../dtos/user/health/health-details.request.dto";
import { HealthCalculatorHelper } from "../../../helper/user/health/health-calculator.helper";

@injectable()
export class HealthDetailsService implements IHealthDetailsService {
  constructor(
    @inject(TYPES.IHealthDetailsRepository)
    private _healthDetailsRepository: IHealthDetailsRepository,

    @inject(TYPES.IHealthProgressRepository)
    private _healthProgressRepository: IHealthProgressRepository,
  ) {}

  async getHealthDetails(
    userId: string,
  ): Promise<HealthDetailsResponseDto | null> {
    logger.info("Fetching health details", { userId });
    if (!userId) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }
    const healthDetails =
      await this._healthDetailsRepository.findByUserId(userId);
    if (!healthDetails) {
      logger.warn("Health details not found", { userId });
      return null;
    }
    const bmi = HealthCalculatorHelper.calculateBMI(
      healthDetails.heightCm,
      healthDetails.weightKg,
    );
    return HealthDetailsMapper.toResponseDto(healthDetails, bmi);
  }

  async saveHealthDetails(
    userId: string,
    dto: HealthDetailsRequestDto,
  ): Promise<HealthDetailsResponseDto> {
    logger.info("Saving health details", { userId });
    HealthDetailsValidator.validate(dto);
    const bmi = HealthCalculatorHelper.calculateBMI(dto.heightCm, dto.weightKg);
    const healthDetails = await this._healthDetailsRepository.upsertByUserId(
      userId,
      HealthDetailsMapper.toPersistence(dto),
    );
    if (!healthDetails) {
      throw new CustomError(
        "Failed to save health details",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await this._healthProgressRepository.upsertDailyProgress({
      userId,
      date: today,
      weightKg: dto.weightKg,
      bmi,
      dailyWaterIntakeLiters: dto.dailyWaterIntakeLiters,
      sleepDurationHours: dto.sleepDurationHours,
    });
    logger.info("Health details saved successfully", { userId });
    return HealthDetailsMapper.toResponseDto(healthDetails, bmi);
  }
}
