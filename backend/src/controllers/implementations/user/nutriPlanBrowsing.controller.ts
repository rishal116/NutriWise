import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { COMMON_MESSAGES } from "../../../constants";

import { asyncHandler } from "../../../utils/asyncHandler";

import { INutritionistPlanBrowsingController } from "../../interfaces/user/INutritionistPlanBrowsingController";
import { INutritionistPlanBrowsingService } from "../../../services/interfaces/user/INutritionistPlanBrowsingService";

@injectable()
export class NutritionistPlanBrowsingController implements INutritionistPlanBrowsingController {
  constructor(
    @inject(TYPES.INutritionistPlanBrowsingService)
    private readonly _nutritionistPlanBrowsingService: INutritionistPlanBrowsingService,
  ) {}

  getPlans = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;

    const plans =
      await this._nutritionistPlanBrowsingService.getPlans(username);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: plans,
    });
  });

  getPlanBySlug = asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    console.log("controller called");
    console.log("params:", req.params);

    const plan =
      await this._nutritionistPlanBrowsingService.getPlanBySlug(slug);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: plan,
    });
  });
}
