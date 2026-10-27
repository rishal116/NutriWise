import type { INotificationProjection } from "../../types/notification/notification.projection";
import type { NotificationResponseDTO } from "../../dtos/notification/notification-response.dto";

export class NotificationMapper {
  static toResponseDTO(
    notification: INotificationProjection,
  ): NotificationResponseDTO {
    return {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      ...(notification.data !== undefined && {
        data: notification.data,
      }),
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      senderName: notification.senderName,
    };
  }
}