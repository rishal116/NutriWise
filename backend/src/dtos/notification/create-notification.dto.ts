import type { Types } from "mongoose";
import type { NotificationType } from "../../models/notification.model";

export interface CreateNotificationDTO {
  recipientId: string | Types.ObjectId;
  senderId?: string | Types.ObjectId | null;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | Map<string, unknown>;
}
