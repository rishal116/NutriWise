
export interface NotificationDto {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  userId: string;     // the user/admin who will receive the notification
  senderId?: string;  // optional: who triggered the notification
  read?: boolean;     // default false
}