import { Request, Response, NextFunction } from "express";

export interface IUserProgramController {
  getPrograms: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDetails: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDays: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDayDetails: (req: Request, res: Response, next: NextFunction) => void;
}