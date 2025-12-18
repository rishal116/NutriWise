export interface NotificationDto {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  recipientType: "user" | "admin";
  receiverId?: string;
  senderId?: string;
  read?: boolean;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  search?: string;
  receiverId?: string;
  recipientType?: string;
}