import { Request, Response, NextFunction } from "express";

export interface IAdminChallengeController {
  createChallenge(req: Request, res: Response, next: NextFunction): void;

  browseChallenges(req: Request, res: Response, next: NextFunction): void;

  getChallenge(req: Request, res: Response, next: NextFunction): void;

  updateChallenge(req: Request, res: Response, next: NextFunction): void;

  deleteChallenge(req: Request, res: Response, next: NextFunction): void;

  publishChallenge(req: Request, res: Response, next: NextFunction): void;
}
