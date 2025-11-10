import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../types/types";
import { IAdminNotificationController } from "../../interfaces/admin/IAdminNotificationController";
import { IAdminNotificationService } from "../../../services/interfaces/INotificationService";
import {asyncHandler} from "../../../utils/asyncHandler";

@injectable()
export class AdminNotificationController implements IAdminNotificationController {
  constructor(
    @inject(TYPES.IAdminNotificationService)
    private _adminNotificationService: IAdminNotificationService
  ) {}

  getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const notifications = await this._adminNotificationService.getAllNotifications();
    res.status(200).json({ success: true, notifications });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this._adminNotificationService.markNotificationRead(id);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this._adminNotificationService.deleteNotification(id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  });

  approveNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await this._adminNotificationService.approveNutritionist(userId);
    res.status(200).json({ success: true, message: "Nutritionist approved" });
  });

  rejectNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { reason } = req.body;
    if (!reason) {
      res.status(400).json({ success: false, message: "Rejection reason is required" });
      return;
    }
    await this._adminNotificationService.rejectNutritionist(userId, reason);
    res.status(200).json({ success: true, message: "Nutritionist rejected" });
  });
}
