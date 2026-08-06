import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IHealthDetailsController } from "../../interfaces/user/IHealthDetailsController";
import { IHealthDetailsService } from "../../../services/interfaces/user/account/IHealthDetailsService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { COMMON_MESSAGES, USER_MESSAGES } from "../../../constants";

@injectable()
export class HealthDetailsController implements IHealthDetailsController {
  constructor(
    @inject(TYPES.IHealthDetailsService)
    private _healthDetailsService: IHealthDetailsService,
  ) {}

  getHealthDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const healthDetails =
      await this._healthDetailsService.getHealthDetails(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: healthDetails,
    });
  });

  saveHealthDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const healthDetails = await this._healthDetailsService.saveHealthDetails(
      userId,
      req.body,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.HEALTH_DETAILS_UPDATED,
      data: healthDetails,
    });
  });
}
