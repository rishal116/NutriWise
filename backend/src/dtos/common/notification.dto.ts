import type { INotification } from "../../models/notification.model";
import type { NotificationType } from "../../constants/notification/notification-type.constants";

export class NotificationDTO {
  id: string;

  senderId: string | null;

  type: NotificationType;

  title: string;

  message: string;

  data?: Record<string, unknown>;

  isRead: boolean;

  readAt: Date | null;

  createdAt: Date;

  constructor(notification: INotification) {
    this.id = notification._id.toString();
    this.senderId = notification.senderId?.toString() ?? null;
    this.type = notification.type;
    this.title = notification.title;
    this.message = notification.message;
    this.data = notification.data
      ? Object.fromEntries(notification.data)
      : undefined;
    this.isRead = notification.isRead;
    this.readAt = notification.readAt ?? null;
    this.createdAt = notification.createdAt;
  }
}