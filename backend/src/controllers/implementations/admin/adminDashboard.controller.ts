import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import { IAdminDashboardController } from "../../interfaces/admin/IAdminDashboardController";
import { IAdminDashboardService } from "../../../services/interfaces/admin/IAdminDashboardService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminDashboardController implements IAdminDashboardController {
  constructor(
    @inject(TYPES.IAdminDashboardService)
    private readonly _dashboardService: IAdminDashboardService,
  ) {}

  getOverview = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
      const overview = await this._dashboardService.getOverview();

      res.status(StatusCode.OK).json({
        success: true,
        data: overview,
      });
    },
  );
}
