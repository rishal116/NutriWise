import { INotification } from "../../models/notification.model";

export interface INotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  senderId?: string;
  createdAt: Date;
}

export class NotificationDTO implements INotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  senderId?: string;
  createdAt: Date;

  constructor(notification: INotification) {
    this.id = notification._id.toString();
    this.title = notification.title;
    this.message = notification.message;
    this.type = notification.type;
    this.read = notification.read;
    this.senderId = notification.senderId?.toString();
    this.createdAt = notification.createdAt;
  }
}