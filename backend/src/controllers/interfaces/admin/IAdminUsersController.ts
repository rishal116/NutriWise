import { Request, Response, NextFunction } from "express";

export interface IAdminUsersController {
    getAllClients(req: Request, res: Response, next: NextFunction): void;
    getAllNutritionist(req: Request, res: Response, next: NextFunction): void;
    blockUser(req: Request, res: Response, next: NextFunction): void;
    unblockUser(req: Request, res: Response, next: NextFunction): void;
    getNutritionistDetails(req: Request, res: Response, next: NextFunction): void;
}

