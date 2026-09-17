import type { RequestHandler } from "express";

export interface INutriDashboardController {
  getOverview: RequestHandler;
}