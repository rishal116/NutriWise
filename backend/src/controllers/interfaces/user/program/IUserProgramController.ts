import type { RequestHandler } from "express";

export interface IUserProgramController {
  browsePrograms: RequestHandler;
  getProgramDetails: RequestHandler;
}
