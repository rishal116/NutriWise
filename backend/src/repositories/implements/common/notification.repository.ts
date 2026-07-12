import { FilterQuery } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { INotificationRepository } from "../../interfaces/common/INotificationRepository";
import {
  INotification,
  NotificationModel,
} from "../../../models/notification.model";

export class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async getNotifications(
    recipientId: string,
    skip: number,
    limit: number,
  ): Promise<INotification[]> {
    return this._model
      .find({ recipientId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<INotification[]>();
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this._model.countDocuments({
      recipientId,
      isRead: false,
    });
  }

  async markAsRead(
    notificationId: string,
    recipientId: string,
  ): Promise<boolean> {
    const result = await this._model.updateOne(
      {
        _id: notificationId,
        recipientId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    return result.modifiedCount > 0;
  }

  async markAllAsRead(recipientId: string): Promise<number> {
    const result = await this._model.updateMany(
      {
        recipientId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    );

    return result.modifiedCount;
  }

  async deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<boolean> {
    const result = await this._model.deleteOne({
      _id: notificationId,
      recipientId,
    });

    return result.deletedCount > 0;
  }

  async deleteMany(filter: FilterQuery<INotification>): Promise<number> {
    const result = await this._model.deleteMany(filter);

    return result.deletedCount;
  }
}
