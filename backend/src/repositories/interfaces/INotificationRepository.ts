import { INotification } from "../../models/notification.model";
import { NotificationDto } from "../../dtos/common/notification.dto";

export interface IAdminNotificationRepository {
  getAllNotifications(): Promise<any[]>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;

  // Add this
  createNotification(data: NotificationDto): Promise<void>;
  approveNutritionist(userId: string): Promise<void>;
  rejectNutritionist(userId: string, reason: string): Promise<void>;
}
