import { injectable, inject } from "inversify";
import { IHealthProgressService } from "../../interfaces/user/IHealthProgress.Service";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IHealthProgressRepository } from "../../../repositories/interfaces/user/IHealthProgressRepository";
import {
  HealthProgressResponseDTO,
  IHealthProgressData,
} from "../../../dtos/user/healthProgress.dto";
import { IHealthProgress } from "../../../models/healthProgress.model";

interface IProgressPoint {
  date: Date;
  value: number;
}

@injectable()
export class HealthProgressService implements IHealthProgressService {
  constructor(
    @inject(TYPES.IHealthProgressRepository)
    private _healthProgressRepository: IHealthProgressRepository,
  ) {}

  async getHealthProgress(
    userId: string,
    days = 30,
  ): Promise<HealthProgressResponseDTO> {
    try {
      if (!userId) {
        throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
      }

      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setDate(toDate.getDate() - days);

      const progressRecords =
        await this._healthProgressRepository.findByUserAndDateRange(
          userId,
          fromDate,
          toDate,
        );

      return this.formatProgress(progressRecords);
    } catch (error) {
      logger.error("Error in getHealthProgress", error);
      throw error;
    }
  }

  async getProgressByDate(
    userId: string,
    date: Date,
  ): Promise<IHealthProgressData | null> {
    try {
      if (!userId || !date) {
        throw new CustomError(
          "User ID and date required",
          StatusCode.BAD_REQUEST,
        );
      }

      const records =
        await this._healthProgressRepository.findByUserAndDateRange(
          userId,
          date,
          date,
        );

      return records.length > 0 ? records[0] : null;
    } catch (error) {
      logger.error("Error in getProgressByDate", error);
      throw error;
    }
  }

  async getLatestProgress(userId: string): Promise<IHealthProgressData | null> {
    try {
      if (!userId) {
        throw new CustomError("User ID required", StatusCode.BAD_REQUEST);
      }

      return await this._healthProgressRepository.findLatestByUserId(userId);
    } catch (error) {
      logger.error("Error in getLatestProgress", error);
      throw error;
    }
  }

  private formatProgress(
    records: IHealthProgress[],
  ): HealthProgressResponseDTO {
    const weightProgress: IProgressPoint[] = [];
    const bmiProgress: IProgressPoint[] = [];
    const waterProgress: IProgressPoint[] = [];
    const sleepProgress: IProgressPoint[] = [];

    for (const record of records) {
      if (record.weightKg !== undefined) {
        weightProgress.push({
          date: record.date,
          value: record.weightKg,
        });
      }

      if (record.bmi !== undefined) {
        bmiProgress.push({
          date: record.date,
          value: record.bmi,
        });
      }

      if (record.dailyWaterIntakeLiters !== undefined) {
        waterProgress.push({
          date: record.date,
          value: record.dailyWaterIntakeLiters,
        });
      }

      if (record.sleepDurationHours !== undefined) {
        sleepProgress.push({
          date: record.date,
          value: record.sleepDurationHours,
        });
      }
    }

    return {
      weightProgress,
      bmiProgress,
      waterProgress,
      sleepProgress,
    };
  }
}
