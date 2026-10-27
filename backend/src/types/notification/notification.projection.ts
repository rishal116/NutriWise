import type { NotificationType } from "../../models/notification.model";

export interface INotificationProjection {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
  senderName: string | null;
}
