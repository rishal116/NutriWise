import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { NUTRITIONIST_PLAN_MESSAGES } from "../../../constants/nutritionist/plan/nutritionist-plan-messages.constants";
import type { INutritionistPlanController } from "../../interfaces/nutritionist/INutriPlanController";
import type { INutritionistPlanService } from "../../../services/interfaces/nutritionist/INutriPlanService";
import { GetPlansDTO } from "../../../dtos/nutritionist/plan/get-plans.dto";
import { UpdatePlanStatusDTO } from "../../../dtos/nutritionist/plan/update-plan-status.dto";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

@injectable()
export class NutritionistPlanController implements INutritionistPlanController {
  constructor(
    @inject(TYPES.INutritionistPlanService)
    private readonly _planService: INutritionistPlanService,
  ) {}

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;

    await this._planService.createPlan(nutritionistId, req.body);

    return sendResponse(
      res,
      StatusCode.CREATED,
      NUTRITIONIST_PLAN_MESSAGES.CREATED,
    );
  });

  updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    await this._planService.updatePlan(nutritionistId, planId, req.body);

    return sendResponse(res, StatusCode.OK, NUTRITIONIST_PLAN_MESSAGES.UPDATED);
  });

  updatePlanStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const payload = plainToInstance(UpdatePlanStatusDTO, req.body);

    await this._planService.updatePlanStatus(nutritionistId, planId, payload);

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_MESSAGES.STATUS_UPDATED,
    );
  });

  getMyPlans = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const query = plainToInstance(GetPlansDTO, req.query);

    const plans = await this._planService.getNutritionistPlans(
      nutritionistId,
      query,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_MESSAGES.FETCHED,
      plans,
    );
  });

  getPlanById = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const plan = await this._planService.getPlanById(nutritionistId, planId);

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_MESSAGES.FETCHED_ONE,
      plan,
    );
  });

  getPlanMetadata = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;

    const metadata = await this._planService.getPlanMetadata(nutritionistId);

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_MESSAGES.METADATA_FETCHED,
      metadata,
    );
  });
}
