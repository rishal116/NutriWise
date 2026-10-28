import type { RequestHandler } from "express";

export interface IUserSessionController {
  getUserSessions: RequestHandler;
  getUserSessionDetails: RequestHandler;
}
