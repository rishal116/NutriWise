import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistPlanService } from "../../../services/interfaces/nutritionist/INutritionistPlanService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INutritionistPlanController } from "../../interfaces/nutritionist/INutritionistPlanController";

@injectable()
export class NutritionistPlanController implements INutritionistPlanController {
  constructor(
    @inject(TYPES.INutritionistPlanService)
    private _planService: INutritionistPlanService
  ) {}
  
  
  createPlan = asyncHandler(async (req, res, NextFunction) => {
    console.log("controller")
    const nutritionistId = req.user?.userId;
    if (!nutritionistId) throw new Error("Unauthorized");
    const plan = await this._planService.createPlan(
      nutritionistId,
      req.body
    );
    res.status(201).json({ success: true, data: plan });
  });
  
  
  updatePlan = asyncHandler(async (req, res, NextFunction) => {
    const nutritionistId = req.user?.userId;
    const { planId } = req.params;
    const plan = await this._planService.updatePlan(
      nutritionistId!,
      planId,
      req.body
    );
    res.json({ success: true, data: plan });
  });
  
  
  getMyPlans = asyncHandler(async (req, res, NextFunction) => {
    const nutritionistId = req.user?.userId;
    const plans = await this._planService.getPlansByNutritionist(
      nutritionistId!
    );
    res.json({ success: true, data: plans });
  });

  
}
