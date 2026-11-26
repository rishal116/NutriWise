import type { RequestHandler } from "express";

export interface IAdminSubscriptionPlanController {
  createPlan: RequestHandler;
  browsePlans: RequestHandler;
  getPlan: RequestHandler;
  updatePlan: RequestHandler;
  publishPlan: RequestHandler;
  archivePlan: RequestHandler;
}