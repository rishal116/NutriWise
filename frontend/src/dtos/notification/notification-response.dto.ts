import type { NotificationType } from "@/types/notification/notification.types";

export interface NotificationResponseDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  senderName: string | null;
}