import { RequestHandler } from "express";

export interface IAdminChallengeDayController {
  createDay: RequestHandler;

  listDays: RequestHandler;

  getDay: RequestHandler;

  updateDay: RequestHandler;

  deleteDay: RequestHandler;
}
