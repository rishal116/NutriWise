import { Request, Response, NextFunction } from "express";

export interface IUserChallengeController {
  joinChallenge(req: Request, res: Response, next: NextFunction): void;

  browseChallenges(req: Request, res: Response, next: NextFunction): void;

  getChallenge(req: Request, res: Response, next: NextFunction): void;
}
