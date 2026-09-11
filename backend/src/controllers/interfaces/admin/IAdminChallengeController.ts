import { Request, Response, NextFunction } from "express";

export interface IAdminChallengeController {
  createChallenge(req: Request, res: Response, next: NextFunction): void;

  listChallenges(req: Request, res: Response, next: NextFunction): void;

  getChallengeDetails(req: Request, res: Response, next: NextFunction): void;

  updateChallenge(req: Request, res: Response, next: NextFunction): void;

  deleteChallenge(req: Request, res: Response, next: NextFunction): void;

  publishChallenge(req: Request, res: Response, next: NextFunction): void;
}
