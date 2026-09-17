import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";
import { asyncHandler } from "../../../utils/asyncHandler";

import { INutriDashboardController } from "../../interfaces/nutritionist/INutriDashboardController";
import { INutriDashboardService } from "../../../services/interfaces/nutritionist/INutriDashboardService";

@injectable()
export class NutriDashboardController implements INutriDashboardController {
  constructor(
    @inject(TYPES.INutriDashboardService)
    private readonly _nutriDashboardService: INutriDashboardService,
  ) {}

  getOverview = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    if (!nutritionistId) {
      throw new CustomError("Unauthorized", StatusCode.UNAUTHORIZED);
    }

    const overview =
      await this._nutriDashboardService.getOverview(nutritionistId);

    res.status(StatusCode.OK).json({
      success: true,
      data: overview,
    });
  });
}
