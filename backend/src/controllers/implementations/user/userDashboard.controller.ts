import { inject, injectable } from "inversify";
import type { RequestHandler } from "express";

import { TYPES } from "../../../types/types";

import type { IUserDashboardController } from "../../interfaces/user/IUserDashboardController";
import type { IUserDashboardService } from "../../../services/interfaces/user/IUserDashboardService";

import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class UserDashboardController implements IUserDashboardController {
  constructor(
    @inject(TYPES.IUserDashboardService)
    private readonly _userDashboardService: IUserDashboardService,
  ) {}

  getOverview: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const data = await this._userDashboardService.getOverview(userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Dashboard overview retrieved successfully.",
      data,
    });
  });

  getActivePrograms: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const limit = Number(req.query.limit ?? 5);

    const data = await this._userDashboardService.getActivePrograms(
      userId,
      limit,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Active programs retrieved successfully.",
      data,
    });
  });

  getTodayTracking: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const date = req.query.date
      ? new Date(String(req.query.date))
      : new Date();

    const data = await this._userDashboardService.getTodayTracking(
      userId,
      date,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Today's tracking retrieved successfully.",
      data,
    });
  });

  getWeeklyProgress: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const startDate = new Date(String(req.query.startDate ?? ""));
    const endDate = new Date(String(req.query.endDate ?? ""));

    const data = await this._userDashboardService.getWeeklyProgress(
      userId,
      startDate,
      endDate,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Weekly progress retrieved successfully.",
      data,
    });
  });

  getUpcomingConsultations: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const limit = Number(req.query.limit ?? 5);

    const data = await this._userDashboardService.getUpcomingConsultations(
      userId,
      limit,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Upcoming consultations retrieved successfully.",
      data,
    });
  });

  getPaymentOverview: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const startDate = new Date(String(req.query.startDate ?? ""));
    const endDate = new Date(String(req.query.endDate ?? ""));

    const data = await this._userDashboardService.getPaymentOverview(
      userId,
      startDate,
      endDate,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Payment overview retrieved successfully.",
      data,
    });
  });
}