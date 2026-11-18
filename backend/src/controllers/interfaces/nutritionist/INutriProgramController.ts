import type { RequestHandler } from "express";

export interface INutriProgramController {
  getPrograms: RequestHandler;
  getProgramDetails: RequestHandler;
  markProgramAsReady: RequestHandler;
}
