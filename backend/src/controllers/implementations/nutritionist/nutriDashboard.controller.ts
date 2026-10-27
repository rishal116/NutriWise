import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import type { INutriDashboardController } from "../../interfaces/nutritionist/INutriDashboardController";
import type { INutriDashboardService } from "../../../services/interfaces/nutritionist/INutriDashboardService";

@injectable()
export class NutriDashboardController implements INutriDashboardController {
  constructor(
    @inject(TYPES.INutriDashboardService)
    private readonly _nutriDashboardService: INutriDashboardService,
  ) {}

  getOverview = asyncHandler(async (req: Request, res: Response) => {
    const overview = await this._nutriDashboardService.getOverview(
      req.user!.userId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Dashboard overview retrieved successfully",
      data: overview,
    });
  });

  getEarningsChart = asyncHandler(async (req: Request, res: Response) => {
    const months = req.query.months ? Number(req.query.months) : 6;

    const earnings = await this._nutriDashboardService.getEarningsChart(
      req.user!.userId,
      months,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Earnings chart retrieved successfully",
      data: earnings,
    });
  });

  getRecentActivities = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 5;

    const cursor =
      typeof req.query.cursor === "string" ? req.query.cursor : undefined;

    const activities = await this._nutriDashboardService.getRecentActivities(
      req.user!.userId,
      limit,
      cursor,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Recent activities retrieved successfully",
      data: activities,
    });
  });
}
