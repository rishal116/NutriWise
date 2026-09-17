import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";

import { INutriDashboardService } from "../../interfaces/nutritionist/INutriDashboardService";

import { INutritionistDashboardRepository } from "../../interfaces/nutritionist/INutriDashboardRepository"; 

import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";

import { toNutriDashboardOverviewDTO } from "../../../mappers/nutritionist/dashboard/nutri-dashboard-overview.mapper";

@injectable()
export class NutriDashboardService implements INutriDashboardService {
  constructor(
    @inject(TYPES.INutriDashboardRepository)
    private readonly _nutriDashboardRepository: INutritionistDashboardRepository,
  ) {}

  async getOverview(
    nutritionistId: string,
  ): Promise<NutriDashboardOverviewDTO> {
    this.validateNutritionistId(nutritionistId);

    const overview =
      await this._nutriDashboardRepository.getOverview(nutritionistId);

    return toNutriDashboardOverviewDTO(overview);
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
