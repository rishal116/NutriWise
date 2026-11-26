import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { sendResponse } from "../../../utils/responseHandler";

import type { IAdminSubscriptionPlanService } from "../../../services/interfaces/admin/IAdminSubscriptionPlanService";
import type { IAdminSubscriptionPlanController } from "../../interfaces/admin/IAdminSubscriptionPlanController";

import type { AdminSubscriptionPlanListQueryDTO } from "../../../dtos/admin/subscription-plan/admin-subscription-plan-list-query.dto";
import type { CreateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/create-subscription-plan.dto";
import type { UpdateSubscriptionPlanDTO } from "../../../dtos/admin/subscription-plan/update-subscription-plan.dto";

import { ADMIN_SUBSCRIPTION_PLAN_MESSAGES } from "../../../constants/admin/subscription-plan.constants";

@injectable()
export class AdminSubscriptionPlanController
  implements IAdminSubscriptionPlanController
{
  constructor(
    @inject(TYPES.IAdminSubscriptionPlanService)
    private readonly _subscriptionPlanService: IAdminSubscriptionPlanService,
  ) {}

  createPlan = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateSubscriptionPlanDTO = req.body;

    await this._subscriptionPlanService.createPlan(data);

    return sendResponse(
      res,
      StatusCode.CREATED,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.CREATED,
    );
  });

  browsePlans = asyncHandler(async (req: Request, res: Response) => {
    const query =
      req.query as unknown as AdminSubscriptionPlanListQueryDTO;

    const result = await this._subscriptionPlanService.browsePlans(query);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.FETCHED,
      result,
    );
  });

  getPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    const result = await this._subscriptionPlanService.getPlan(planId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.DETAILS_FETCHED,
      result,
    );
  });

  updatePlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;
    const data: UpdateSubscriptionPlanDTO = req.body;

    await this._subscriptionPlanService.updatePlan(planId, data);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.UPDATED,
    );
  });

  publishPlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    await this._subscriptionPlanService.publishPlan(planId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.PUBLISHED,
    );
  });

  archivePlan = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.params;

    await this._subscriptionPlanService.archivePlan(planId);

    return sendResponse(
      res,
      StatusCode.OK,
      ADMIN_SUBSCRIPTION_PLAN_MESSAGES.ARCHIVED,
    );
  });
}