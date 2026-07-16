import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";
import { INutritionistPlanController } from "../../interfaces/nutritionist/INutriPlanController";
import { INutritionistPlanService } from "../../../services/interfaces/nutritionist/INutriPlanService";
import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import { plainToInstance } from "class-transformer";

@injectable()
export class NutritionistPlanController implements INutritionistPlanController {
  constructor(
    @inject(TYPES.INutritionistPlanService)
    private readonly _planService: INutritionistPlanService,
  ) {}

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;

    const plan = await this._planService.createPlan(nutritionistId, req.body);

    res.status(StatusCode.CREATED).json({
      success: true,
      data: plan,
    });
  });

  updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const plan = await this._planService.updatePlan(
      nutritionistId,
      planId,
      req.body,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: plan,
    });
  });

  getMyPlans = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const query = plainToInstance(GetPlansDTO, req.query);
    const plans = await this._planService.getPlansByNutritionist(
      nutritionistId,
      query,
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: plans,
    });
  });

  getPlanById = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const plan = await this._planService.getPlanById(nutritionistId, planId);

    res.status(StatusCode.OK).json({
      success: true,
      data: plan,
    });
  });

  getPlanMetadata = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;

    const metadata = await this._planService.getPlanMetadata(nutritionistId);

    res.status(StatusCode.OK).json({
      success: true,
      data: metadata,
    });
  });
}
