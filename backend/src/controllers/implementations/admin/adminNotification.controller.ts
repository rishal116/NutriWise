import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../types/types";
import { IAdminNotificationController } from "../../interfaces/admin/IAdminNotificationController";
import { INotificationService } from "../../../services/interfaces/admin/INotificationService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_NOTIFICATION_MESSAGES } from "../../../constants";

@injectable()
export class AdminNotificationController implements IAdminNotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private _adminNotificationService: INotificationService,
  ) {}

  getAllNotifications = asyncHandler(async (req: Request, res: Response) => {
    const adminId = process.env.ADMIN_ID!;
    const pageNumber = Number(req.query.page) || 1;
    const pageLimit = Number(req.query.limit) || 10;
    const searchKeyword = (req.query.search as string) || "";
    const recipientType = "admin";
    const notificationsResult =
      await this._adminNotificationService.getNotifications(
        adminId!,
        recipientType,
        pageNumber,
        pageLimit,
        searchKeyword,
      );
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NOTIFICATION_MESSAGES.FETCH_SUCCESS,
      data: notificationsResult,
    });
  });

  markAsRead = asyncHandler(async (req: Request, res: Response) => {
    const notificationId = req.params.id;
    await this._adminNotificationService.markNotificationRead(notificationId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NOTIFICATION_MESSAGES.MARK_ONE_READ,
    });
  });

  markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
    const adminId = req.user?.userId;
    const recipientType = "admin";
    await this._adminNotificationService.markAllNotificationsRead(
      adminId!,
      recipientType,
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NOTIFICATION_MESSAGES.MARK_ALL_READ,
    });
  });
}
