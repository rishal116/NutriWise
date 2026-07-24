import { Request, Response, NextFunction } from "express";

export interface INutriProgramController {
  getPrograms: (req: Request, res: Response, next: NextFunction) => void;

  getProgramDetails: (req: Request, res: Response, next: NextFunction) => void;
}
