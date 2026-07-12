import { INotification } from "../../models/notification.model";

export class NotificationDTO {
  id: string;

  senderId: string | null;

  type: string;

  title: string;

  message: string;

  data?: Record<string, unknown>;

  isRead: boolean;

  readAt: Date | null;

  createdAt: Date;

  constructor(notification: INotification) {
    this.id = notification._id.toString();
    this.senderId = notification.senderId
      ? notification.senderId.toString()
      : null;
    this.type = notification.type;
    this.title = notification.title;
    this.message = notification.message;
    this.data = notification.data;
    this.isRead = notification.isRead;
    this.readAt = notification.readAt ?? null;
    this.createdAt = notification.createdAt;
  }
}
