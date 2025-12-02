import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../types/types";
import { IAdminNotificationController } from "../../interfaces/admin/IAdminNotificationController";
import { INotificationService } from "../../../services/interfaces/INotificationService";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class AdminNotificationController implements IAdminNotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private _adminNotificationService: INotificationService,
  ) {}


  getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const receiverId = process.env.ADMIN_ID!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const recipientType = "admin"
    const result = await this._adminNotificationService.getNotifications(
      receiverId!,
      recipientType,
      page,
      limit,
      search
    );
    res.status(200).json({ success: true, ...result });
  });


  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this._adminNotificationService.markNotificationRead(id);
    res.status(200).json({ success: true, message: "Notification marked as read" });
  });

  
  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const receiverId = req.user?.userId;
    const recipientType = "admin"
    await this._adminNotificationService.markAllNotificationsRead(receiverId!,recipientType);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  });
  
  
  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    await this._adminNotificationService.deleteNotification(id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  });


}
