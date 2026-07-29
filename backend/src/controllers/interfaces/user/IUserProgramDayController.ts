import { Request, Response, NextFunction } from "express";

export interface IUserProgramDayController {
  browseProgramDays: (req: Request, res: Response, next: NextFunction) => void;

  getDayDetails: (req: Request, res: Response, next: NextFunction) => void;
}
