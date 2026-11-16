import type { RequestHandler } from "express";

export interface IProgramHealthController {
  createProgramHealth: RequestHandler;
  getProgramHealth: RequestHandler;
  updateProgramHealth: RequestHandler;
}
