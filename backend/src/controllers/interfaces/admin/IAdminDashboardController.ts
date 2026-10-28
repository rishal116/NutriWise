import type { RequestHandler } from "express";

export interface IAdminDashboardController {
  getOverview: RequestHandler;
  getRegistrationTrend: RequestHandler;
  getRevenueTrend: RequestHandler;
  getRecentUsers: RequestHandler;
  getPendingNutritionists: RequestHandler;
  getRecentPayments: RequestHandler;
}