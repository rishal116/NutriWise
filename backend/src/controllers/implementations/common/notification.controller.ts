import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INotificationController } from "../../interfaces/common/INotificationController";
import { INotificationService } from "../../../services/interfaces/common/INotificationService";
import { NotificationQueryDTO } from "../../../dtos/notification/notification-query.dto";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.INotificationService)
    private readonly _notificationService: INotificationService,
  ) {}

  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const recipientId = req.user!.userId;

    const query: NotificationQueryDTO = {
      limit: Number(req.query.limit) || 10,
      cursor: req.query.cursor as string,
      isRead:
        req.query.isRead === "true"
          ? true
          : req.query.isRead === "false"
            ? false
            : undefined,
    };

    const notifications = await this._notificationService.getNotifications(
      recipientId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: notifications,
    });
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const recipientId = req.user!.userId;

    const count = await this._notificationService.getUnreadCount(recipientId);

    res.status(StatusCode.OK).json({
      success: true,
      data: { count },
    });
  });

  markNotificationRead = asyncHandler(async (req: Request, res: Response) => {
    const { notificationId } = req.params;
    const recipientId = req.user!.userId;

    await this._notificationService.markNotificationRead(
      notificationId,
      recipientId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Notification marked as read successfully",
    });
  });

  markAllNotificationsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const recipientId = req.user!.userId;

      await this._notificationService.markAllNotificationsRead(recipientId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "All notifications marked as read successfully",
      });
    },
  );
}
