import { Request, Response, NextFunction } from "express";

export interface IUserProgramController {
  browsePrograms: (req: Request, res: Response, next: NextFunction) => void;
  getProgramDetails: (req: Request, res: Response, next: NextFunction) => void;
}
