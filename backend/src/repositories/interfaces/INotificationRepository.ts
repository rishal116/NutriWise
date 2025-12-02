import { INotification } from "../../models/notification.model";
import { NotificationDto } from "../../dtos/common/notification.dto";
import { NotificationQuery } from "../../dtos/common/notification.dto";

export interface INotificationRepository {
  getNotifications(query: NotificationQuery): Promise<{ data: INotification[]; total: number }>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  createNotification(data: NotificationDto): Promise<void>;
  markAllRead(receiverId: string, recipientType: "user" | "admin"): Promise<void>;
}
