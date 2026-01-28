import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminPlanController } from "../../interfaces/admin/IAdminPlanController";
import { IAdminPlanService } from "../../../services/interfaces/admin/IAdminPlanService";

@injectable()
export class AdminPlanController implements IAdminPlanController {
  constructor(
    @inject(TYPES.IAdminPlanService)
    private _planService: IAdminPlanService
  ) {}
  
  getAllPlans = asyncHandler(async ( req: Request, res: Response) => {
    const plans = await this._planService.getAllPlans();
    res.status(StatusCode.OK).json({
      success: true,
      data: plans,
    });
  });

  publishPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    const plan = await this._planService.publishPlan(planId);
    res.status(StatusCode.OK).json({
      success: true,
      data: plan,
      message: "Plan published successfully",
    });
  });

}
