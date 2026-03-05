import { injectable, inject } from "inversify";
import { IHealthDetailsService } from "../../interfaces/user/IHealthDetailsService";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/IHealthDetailsRepository";
import { TYPES } from "../../../types/types";
import {
  HealthDetailsRequestDTO,
  HealthDetailsResponseDTO,
} from "../../../dtos/user/healthDetails.dto";
import { HealthDetailsMapper } from "../../../mapper/user/healthDetails.mapper";
import { HealthDetailsValidator } from "../../../validations/user/healthDetails.validator";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class HealthDetailsService implements IHealthDetailsService {
  constructor(
    @inject(TYPES.IHealthDetailsRepository)
    private _healthDetailsRepository: IHealthDetailsRepository
  ) {}

  async getHealthDetails(
    userId: string
  ): Promise<HealthDetailsResponseDTO | null> {
    logger.info("Fetching health details", { userId });

    if (!userId) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    try {
      const healthDetails =
        await this._healthDetailsRepository.findByUserId(userId);

      if (!healthDetails) {
        logger.warn("Health details not found", { userId });
        return null;
      }

      return HealthDetailsMapper.toResponse(healthDetails);
    } catch (error) {
      logger.error("Error fetching health details", {
        userId,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to fetch health details",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async saveHealthDetails(
    userId: string,
    payload: HealthDetailsRequestDTO
  ): Promise<HealthDetailsResponseDTO> {
    logger.info("Saving health details", { userId });

    try {
      HealthDetailsValidator.validate(userId, payload);

      const bmi = HealthDetailsValidator.calculateBMI(
        payload.heightCm,
        payload.weightKg
      );

      const persistenceData = HealthDetailsMapper.toEntity(
        userId,
        payload,
        bmi
      );

      const savedHealthDetails =
        await this._healthDetailsRepository.upsertByUserId(
          userId,
          persistenceData
        );

      logger.info("Health details saved successfully", { userId });

      return HealthDetailsMapper.toResponse(savedHealthDetails);
    } catch (error) {
      logger.error("Error saving health details", {
        userId,
        payload,
        err: error,
      });

      if (error instanceof CustomError) throw error;

      throw new CustomError(
        "Failed to save health details",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}