import { Request, Response, NextFunction } from "express";

export interface IAdminNotificationController {
  getAllNotifications(req: Request, res: Response, next: NextFunction): void;
  markAsRead(req: Request, res: Response, next: NextFunction): void;
  deleteNotification(req: Request, res: Response, next: NextFunction): void;
  approveNutritionist(req: Request, res: Response, next: NextFunction): void;
  rejectNutritionist(req: Request, res: Response, next: NextFunction): void;
}
