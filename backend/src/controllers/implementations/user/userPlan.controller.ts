import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IUserPlanService } from "../../../services/interfaces/user/IUserPlanService";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserPlanController } from "../../interfaces/user/IUserPlanController";
import { asyncHandler } from "../../../utils/asyncHandler";
import { USER_MESSAGES } from "../../../constants";

@injectable()
export class UserPlanController implements IUserPlanController {
  constructor(
    @inject(TYPES.IUserPlanService)
    private _userPlanService: IUserPlanService
  ) {}

  getMyPlans = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const plans = await this._userPlanService.getMyPlans(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PLANS_FETCHED,
      data: plans,
    });
  });
  
  getPlanById = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    const { userId } = req.user!;
    const plan = await this._userPlanService.getPlanById(planId, userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: USER_MESSAGES.PLANS_FETCHED,
      data: plan,
    });
  });

}
