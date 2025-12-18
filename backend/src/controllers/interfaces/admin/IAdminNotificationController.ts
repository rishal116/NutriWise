import { Request, Response, NextFunction } from "express";

export interface IAdminNotificationController {
  getAllNotifications(req: Request, res: Response, next: NextFunction): void;
  markAsRead(req: Request, res: Response, next: NextFunction): void;
  markAllAsRead(req: Request, res: Response, next: NextFunction): void;
}
