import type { Request, Response, NextFunction } from "express";

export interface INutriProgramProgressController {
  getProgramOverview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;

  getProgramDays(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;

  getDayActivityResults(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void;
}