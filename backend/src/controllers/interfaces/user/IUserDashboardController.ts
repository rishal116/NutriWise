import type { RequestHandler } from "express";

export interface IUserDashboardController {
  getOverview: RequestHandler;
  getActivePrograms: RequestHandler;
  getTodayTracking: RequestHandler;
  getWeeklyProgress: RequestHandler;
  getUpcomingConsultations: RequestHandler;
  getPaymentOverview: RequestHandler;
}
