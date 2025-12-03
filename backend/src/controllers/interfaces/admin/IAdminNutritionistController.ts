import { Request, Response, NextFunction } from "express";

export interface IAdminNutritionistController {
    getAllNutritionist(req: Request, res: Response, next: NextFunction): void;
    blockUser(req: Request, res: Response, next: NextFunction): void;
    unblockUser(req: Request, res: Response, next: NextFunction): void;
    getNutritionistDetails(req: Request, res: Response, next: NextFunction): void;
    approveNutritionist(req: Request, res: Response, next: NextFunction): void;
    rejectNutritionist(req: Request, res: Response, next: NextFunction): void;
    getNutritionistProfile(req: Request, res: Response, next: NextFunction): void;
}

