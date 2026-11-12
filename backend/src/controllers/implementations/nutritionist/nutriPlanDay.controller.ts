import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { plainToInstance } from "class-transformer";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { NUTRITIONIST_PLAN_DAY_MESSAGES } from "../../../constants/nutritionist/plan-day/nutritionist-plan-day-messages.constants";

import type { INutritionistPlanDayController } from "../../interfaces/nutritionist/INutriPlanDayController";
import type { INutritionistPlanDayService } from "../../../services/interfaces/nutritionist/INutriPlanDayService";

import {
  CreateNutritionistPlanDayDTO,
  UpdateNutritionistPlanDayDTO,
} from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";
import { NutritionistPlanDayListQueryDTO } from "../../../dtos/nutritionist/plan-day/nutritionist-plan-day-list-query.dto";

import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

@injectable()
export class NutritionistPlanDayController implements INutritionistPlanDayController {
  constructor(
    @inject(TYPES.INutriPlanDayService)
    private readonly _planDayService: INutritionistPlanDayService,
  ) {}

  createPlanDay = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const payload = plainToInstance(CreateNutritionistPlanDayDTO, req.body);

    await this._planDayService.createPlanDay(nutritionistId, planId, payload);

    return sendResponse(
      res,
      StatusCode.CREATED,
      NUTRITIONIST_PLAN_DAY_MESSAGES.CREATED,
    );
  });

  updatePlanDay = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId, dayNumber } = req.params;

    const payload = plainToInstance(UpdateNutritionistPlanDayDTO, req.body);

    await this._planDayService.updatePlanDay(
      nutritionistId,
      planId,
      Number(dayNumber),
      payload,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_DAY_MESSAGES.UPDATED,
    );
  });

  browsePlanDays = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId } = req.params;

    const query = plainToInstance(NutritionistPlanDayListQueryDTO, req.query);

    const days = await this._planDayService.browsePlanDays(
      nutritionistId,
      planId,
      query,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_DAY_MESSAGES.FETCHED,
      days,
    );
  });

  getPlanDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { planId, dayNumber } = req.params;

    const day = await this._planDayService.getPlanDayDetails(
      nutritionistId,
      planId,
      Number(dayNumber),
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRITIONIST_PLAN_DAY_MESSAGES.FETCHED_ONE,
      day,
    );
  });
}
