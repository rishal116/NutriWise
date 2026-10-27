import type { IBaseRepository } from "../common/IBaseRepository";
import type { INotification } from "../../../models/notification.model";
import type { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import type { NotificationQueryDTO } from "../../../dtos/notification/notification-query.dto";
import { INotificationProjection } from "../../../types/notification/notification.projection";

export interface INotificationRepository extends IBaseRepository<INotification> {
  getNotifications(
    recipientId: string,
    query: NotificationQueryDTO,
  ): Promise<CursorPaginationResult<INotificationProjection>>;

  getUnreadCount(recipientId: string): Promise<number>;

  markAsRead(notificationId: string, recipientId: string): Promise<boolean>;

  markAllAsRead(recipientId: string): Promise<number>;
}
