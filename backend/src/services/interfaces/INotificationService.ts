export interface IAdminNotificationService {
  getAllNotifications(): Promise<any[]>;
  markNotificationRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  approveNutritionist(userId: string): Promise<void>;
  rejectNutritionist(userId: string, reason: string): Promise<void>;
}
