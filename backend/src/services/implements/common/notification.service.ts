import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";

import { NotificationDTO } from "../../../dtos/common/notification.dto";

import { INotificationService } from "../../interfaces/common/INotificationService";
import { INotificationRepository } from "../../../repositories/interfaces/common/INotificationRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepo: INotificationRepository,
  ) {}

  async getNotifications(
    recipientId: string,
    page: number,
    limit: number,
  ): Promise<{
    notifications: NotificationDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this._notificationRepo.getNotifications(recipientId, skip, limit),
      this._notificationRepo.count({
        recipientId,
      }),
    ]);

    return {
      notifications: notifications.map(
        (notification) => new NotificationDTO(notification),
      ),
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return this._notificationRepo.getUnreadCount(recipientId);
  }

  async markNotificationRead(
    notificationId: string,
    recipientId: string,
  ): Promise<void> {
    await this._notificationRepo.markAsRead(notificationId, recipientId);
  }

  async markAllNotificationsRead(recipientId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(recipientId);
  }

  async deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<void> {
    await this._notificationRepo.deleteNotification(
      notificationId,
      recipientId,
    );
  }
}
