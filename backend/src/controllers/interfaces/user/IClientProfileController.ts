
import { Request, Response, NextFunction } from "express";

export interface IClientProfileController {
   getMyProfile: (req: Request, res: Response, next: NextFunction) => void;
   createProfile: (req: Request, res: Response, next: NextFunction) => void;
   updateProfile: (req: Request, res: Response, next: NextFunction) => void;
   updateProfileCompletion: (req: Request, res: Response, next: NextFunction) => void;
   deleteProfile: (req: Request, res: Response, next: NextFunction) => void;
}
