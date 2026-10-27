import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";
import type { INutriDashboardRepository } from "../../../repositories/interfaces/nutritionist/INutriDashboardRepository";
import type { INutriDashboardService } from "../../interfaces/nutritionist/INutriDashboardService";
import { CustomError } from "../../../utils/customError";

import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";
import type { NutriDashboardEarningsChartDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-earnings-chart.dto";
import type { NutriDashboardRecentActivityItemDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-recent-activities.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";

import { toNutriDashboardOverviewDTO } from "../../../mappers/nutritionist/dashboard/nutri-dashboard-overview.mapper";
import { toNutriDashboardEarningsChartDTO } from "../../../mappers/nutritionist/dashboard/nutri-dashboard-earnings-chart.mapper";
import { toNutriDashboardRecentActivityItemDTO } from "../../../mappers/nutritionist/dashboard/nutri-dashboard-recent-activities.mapper";

@injectable()
export class NutriDashboardService implements INutriDashboardService {
  constructor(
    @inject(TYPES.INutriDashboardRepository)
    private readonly _nutriDashboardRepository: INutriDashboardRepository,
  ) {}

  async getOverview(
    nutritionistId: string,
  ): Promise<NutriDashboardOverviewDTO> {
    this.validateNutritionistId(nutritionistId);

    const projection =
      await this._nutriDashboardRepository.getOverview(nutritionistId);

    return toNutriDashboardOverviewDTO(projection);
  }

  async getEarningsChart(
    nutritionistId: string,
    months = 6,
  ): Promise<NutriDashboardEarningsChartDTO> {
    this.validateNutritionistId(nutritionistId);

    if (!Number.isInteger(months) || months < 1 || months > 12) {
      throw new CustomError(
        "Months must be an integer between 1 and 12",
        StatusCode.BAD_REQUEST,
      );
    }

    const projection = await this._nutriDashboardRepository.getEarningsChart(
      nutritionistId,
      months,
    );

    return toNutriDashboardEarningsChartDTO(projection);
  }

  async getRecentActivities(
    nutritionistId: string,
    limit = 5,
    cursor?: string,
  ): Promise<InfiniteScrollResponseDTO<NutriDashboardRecentActivityItemDTO>> {
    this.validateNutritionistId(nutritionistId);

    if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
      throw new CustomError(
        "Limit must be an integer between 1 and 20",
        StatusCode.BAD_REQUEST,
      );
    }

    const result = await this._nutriDashboardRepository.getRecentActivities(
      nutritionistId,
      limit,
      cursor,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(toNutriDashboardRecentActivityItemDTO),
      result.nextCursor,
      result.hasMore,
    );
  }
  private validateNutritionistId(nutritionistId: string): void {
    if (!nutritionistId?.trim()) {
      throw new CustomError(
        "Nutritionist ID is required",
        StatusCode.BAD_REQUEST,
      );
    }

    if (!Types.ObjectId.isValid(nutritionistId)) {
      throw new CustomError("Invalid nutritionist ID", StatusCode.BAD_REQUEST);
    }
  }
}
