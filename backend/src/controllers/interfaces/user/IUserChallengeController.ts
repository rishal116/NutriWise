import { Request, Response, NextFunction } from "express";

export interface IUserChallengeController {
    getChallenges: (req: Request, res: Response, next: NextFunction) => void;
    getChallengeBySlug: (req: Request, res: Response, next: NextFunction) => void;
    getChallengeById: (req: Request, res: Response, next: NextFunction) => void;
    getFeaturedChallenges: (req: Request, res: Response, next: NextFunction) => void;
    joinChallenge: (req: Request, res: Response, next: NextFunction) => void;
    getMyChallenges: (req: Request, res: Response, next: NextFunction) => void;
    getChallengeTasks: (req: Request, res: Response, next: NextFunction) => void;
    toggleTaskCompletion: (req: Request, res: Response, next: NextFunction) => void;
}
