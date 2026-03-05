import { Request, Response, NextFunction } from "express";

export interface INutriProgramController {
  getPrograms: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDetails: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDays: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDayDetails: (req: Request, res: Response, next: NextFunction) => void;
  createProgramDay: (req: Request, res: Response, next: NextFunction) => void;
  updateProgramDay: (req: Request, res: Response, next: NextFunction) => void;
  deleteProgramDay: (req: Request, res: Response, next: NextFunction) => void;
}