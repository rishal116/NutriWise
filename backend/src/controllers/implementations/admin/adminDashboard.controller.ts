import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import type { IAdminDashboardController } from "../../interfaces/admin/IAdminDashboardController";
import type { IAdminDashboardService } from "../../../services/interfaces/admin/IAdminDashboardService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.IAdminDashboardService)
    private readonly dashboardService: IAdminDashboardService,
  ) {}

  getOverview = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const overview = await this.dashboardService.getOverview();

      res.status(StatusCode.OK).json({
        success: true,
        message: "Admin dashboard overview fetched successfully",
        data: overview,
      });
    },
  );

  getRegistrationTrend = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { startDate, endDate } = req.query;

      const trends = await this.dashboardService.getRegistrationTrend(
        new Date(startDate as string),
        new Date(endDate as string),
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Registration trends fetched successfully",
        data: trends,
      });
    },
  );

  getRevenueTrend = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { startDate, endDate } = req.query;

      const trends = await this.dashboardService.getRevenueTrend(
        new Date(startDate as string),
        new Date(endDate as string),
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Revenue trends fetched successfully",
        data: trends,
      });
    },
  );

  getRecentUsers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const limit = Number(req.query.limit ?? 10);
      const users = await this.dashboardService.getRecentUsers(limit);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Recent users fetched successfully",
        data: users,
      });
    },
  );

  getPendingNutritionists = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const limit = Number(req.query.limit ?? 10);
      const nutritionists =
        await this.dashboardService.getPendingNutritionists(limit);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Pending nutritionist applications fetched successfully",
        data: nutritionists,
      });
    },
  );

  getRecentPayments = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const limit = Number(req.query.limit ?? 10);
      const payments = await this.dashboardService.getRecentPayments(limit);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Recent payments fetched successfully",
        data: payments,
      });
    },
  );
}
