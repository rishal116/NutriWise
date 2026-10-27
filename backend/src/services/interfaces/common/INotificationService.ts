import type { NotificationResponseDTO } from "../../../dtos/notification/notification-response.dto";
import type { NotificationQueryDTO } from "../../../dtos/notification/notification-query.dto";
import type { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import type { CreateNotificationDTO } from "../../../dtos/notification/create-notification.dto";

export interface INotificationService {
  getNotifications(
    recipientId: string,
    query: NotificationQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<NotificationResponseDTO>>;

  getUnreadCount(recipientId: string): Promise<number>;

  markNotificationRead(
    notificationId: string,
    recipientId: string,
  ): Promise<void>;

  markAllNotificationsRead(recipientId: string): Promise<void>;

  createNotification(
    dto: CreateNotificationDTO,
  ): Promise<NotificationResponseDTO>;
}