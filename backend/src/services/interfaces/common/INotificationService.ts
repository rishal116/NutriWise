import { NotificationDTO } from "../../../dtos/common/notification.dto";

export interface INotificationService {
  getNotifications(
    recipientId: string,
    page: number,
    limit: number,
  ): Promise<{
    notifications: NotificationDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;

  getUnreadCount(recipientId: string): Promise<number>;

  markNotificationRead(
    notificationId: string,
    recipientId: string,
  ): Promise<void>;

  markAllNotificationsRead(recipientId: string): Promise<void>;

  deleteNotification(
    notificationId: string,
    recipientId: string,
  ): Promise<void>;
}
