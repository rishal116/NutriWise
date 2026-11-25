import type { RequestHandler } from "express";

export interface IPublicSessionController {
  getPublicSessions: RequestHandler;
  getPublicSessionDetails: RequestHandler;
}
