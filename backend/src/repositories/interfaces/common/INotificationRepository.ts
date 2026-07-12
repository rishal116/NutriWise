import { IBaseRepository } from "../common/IBaseRepository";
import { FilterQuery } from "mongoose";
import { INotification } from "../../../models/notification.model";

export interface INotificationRepository extends IBaseRepository<INotification> {
  getNotifications(
    recipientId: string,
    skip: number,
    limit: number,
  ): Promise<INotification[]>;

  getUnreadCount(recipientId: string): Promise<number>;

  markAsRead(notificationId: string, recipientId: string): Promise<boolean>;

  markAllAsRead(recipientId: string): Promise<number>;

  deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<boolean>;

  deleteMany(filter: FilterQuery<INotification>): Promise<number>;
}
