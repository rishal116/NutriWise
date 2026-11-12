
import type { RequestHandler } from "express";

export interface INutritionistPlanDayController {
  createPlanDay: RequestHandler;
  updatePlanDay: RequestHandler;
  browsePlanDays: RequestHandler;
  getPlanDayDetails: RequestHandler;
}
