import { injectable, inject } from "inversify";
import { IHealthProgressController } from "../../interfaces/user/IHealthProgressController";
import { TYPES } from "../../../types/types";
import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { IHealthProgressService } from "../../../services/interfaces/user/IHealthProgress.Service";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class HealthProgressController implements IHealthProgressController {
  constructor(
    @inject(TYPES.IHealthProgressService)
    private _healthProgressService: IHealthProgressService
  ) {}
  
  getHealthProgress = asyncHandler(async (req: Request, res: Response ) => {
    const { userId } = req.user!;
    const days = Number(req.query.days) || 30;
    const progress = await this._healthProgressService.getHealthProgress(
      userId,
      days
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: progress,
    });
  });
  
  getProgressByDate = asyncHandler(async (req: Request, res: Response ) => {
    const { userId } = req.user!;
    const { date } = req.query;
    const result = await this._healthProgressService.getProgressByDate(
      userId,
      new Date(date as string)
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });
  
  getLatestProgress = asyncHandler(async (req: Request, res: Response ) => {
    const { userId } = req.user!;
    const result = await this._healthProgressService.getLatestProgress(userId);
    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

}