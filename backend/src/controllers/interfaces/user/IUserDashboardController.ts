import type { RequestHandler } from "express";

export interface IUserDashboardController {
  getOverview: RequestHandler;
}