import { NotificationDTO } from "../../../dtos/admin/notificationList.dto";

export interface INotificationService {
  getNotifications( receiverId: string, recipientType:string, page: number, limit: number, search?: string ): Promise<{
    notifications: NotificationDTO[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;
  markNotificationRead(notificationId: string): Promise<void>;
  markAllNotificationsRead( receiverId: string, recipientType: "user" | "admin" ): Promise<void>;
}
