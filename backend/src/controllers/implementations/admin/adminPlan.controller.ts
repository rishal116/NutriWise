import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";

import { IAdminPlanController } from "../../interfaces/admin/IAdminPlanController";
import { IAdminPlanService } from "../../../services/interfaces/admin/IAdminPlanService";

import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminPlanController implements IAdminPlanController {
  constructor(
    @inject(TYPES.IAdminPlanService)
    private readonly _adminPlanService: IAdminPlanService,
  ) {}

  browsePlans = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this._adminPlanService.browsePlans(
        req.query as unknown as Parameters<IAdminPlanService["browsePlans"]>[0],
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: result,
      });
    },
  );

  archivePlan = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await this._adminPlanService.archivePlan(
        req.params.planId,
      );

      res.status(StatusCode.OK).json({
        success: true,
        data: result,
      });
    },
  );
}
