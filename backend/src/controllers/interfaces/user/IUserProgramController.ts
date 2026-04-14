import { Request, Response, NextFunction } from "express";

export interface IUserProgramController {
  getProgramDays: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDayByNumber: (req: Request, res: Response, next: NextFunction) => void;
}