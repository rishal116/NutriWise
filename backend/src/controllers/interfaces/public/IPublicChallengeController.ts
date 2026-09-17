import { Request, Response, NextFunction } from "express";

export interface IPublicChallengeController {
  getChallengeSections(req: Request, res: Response, next: NextFunction): void;

  getChallengeDetails(req: Request, res: Response, next: NextFunction): void;

  getChallengeDayDetails(req: Request, res: Response, next: NextFunction): void;
}
