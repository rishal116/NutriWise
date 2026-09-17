import type { RequestHandler } from "express";

export interface IAdminPlanController {
  browsePlans: RequestHandler;
  archivePlan: RequestHandler;
}