import { Request, Response, NextFunction } from "express";

export interface IAdminClientController {
    getAllUsers(req: Request, res: Response, next: NextFunction): void;
    blockUser(req: Request, res: Response, next: NextFunction): void;
    unblockUser(req: Request, res: Response, next: NextFunction): void;
}

