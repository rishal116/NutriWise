export interface INotificationService {
  getNotifications( receiverId: string, recipientType:string, page: number, limit: number, search?: string ): Promise<{
    notifications: any[];
    total: number;
    currentPage: number;
    totalPages: number;
  }>;
  markNotificationRead(notificationId: string): Promise<void>;
  markAllNotificationsRead( receiverId: string, recipientType: "user" | "admin" ): Promise<void>;
}
