import { Request, Response } from "express";
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
    private _planService: INutritionistPlanService,
  ) {}

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const nutritionistId = userId;
    const plan = await this._planService.createPlan(nutritionistId, req.body);
    res.status(StatusCode.CREATED).json({ success: true, data: plan });
  });

  updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const nutritionistId = userId;
    const { planId } = req.params;
    const plan = await this._planService.updatePlan(
      nutritionistId,
      planId,
      req.body,
    );
    res.status(StatusCode.OK).json({ success: true, data: plan });
  });

  getMyPlans = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const nutritionistId = userId;
    const plans =
      await this._planService.getPlansByNutritionist(nutritionistId);
    res.status(StatusCode.OK).json({ success: true, data: plans });
  });

  getAllowedPlanCategories = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.user!;
      const nutritionistId = userId;
      const allowedCategories =
        await this._planService.getAllowedPlanCategories(nutritionistId);
      res
        .status(StatusCode.OK)
        .json({ success: true, data: allowedCategories });
    },
  );

  getNutritionistPricing = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const nutritionistId = userId;
    const pricing =
      await this._planService.getNutritionistPricing(nutritionistId);
    res.status(StatusCode.OK).json({ success: true, data: pricing });
  });

  getPlanById = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user?.userId;
    const { planId } = req.params;
    if (!nutritionistId)
      return res
        .status(StatusCode.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    const plan = await this._planService.getPlanById(nutritionistId, planId);
    res.status(StatusCode.OK).json({ success: true, data: plan });
  });
}
