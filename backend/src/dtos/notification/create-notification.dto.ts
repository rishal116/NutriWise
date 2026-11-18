import type { Types } from "mongoose";
import { NotificationType } from "../../constants/notification/notification-type.constants";


export interface CreateNotificationDTO {
  recipientId: string | Types.ObjectId;
  senderId?: string | Types.ObjectId | null;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown> | Map<string, unknown>;
}

