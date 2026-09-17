import { inject, injectable } from "inversify";
import type { RequestHandler } from "express";

import { TYPES } from "../../../types/types";

import { IUserDashboardController } from "../../interfaces/user/IUserDashboardController";
import { IUserDashboardService } from "../../../services/interfaces/user/IUserDashboardService";

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
      data,
    });
  });
}
