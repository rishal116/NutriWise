import type { RequestHandler } from "express";

export interface IAdminDashboardController {
  getOverview: RequestHandler;
}