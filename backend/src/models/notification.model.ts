import { Schema, model, Types } from "mongoose";

export enum NotificationType {
  SYSTEM = "system",
  INFO = "info",
  SUCCESS = "success",
  WARNING = "warning",
  ERROR = "error",
}

export interface INotification {
  _id: Types.ObjectId;

  recipientId: Types.ObjectId;

  senderId?: Types.ObjectId | null;

  type: NotificationType;

  title: string;

  message: string;

  data?: Record<string, unknown>;

  isRead: boolean;

  readAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      default: NotificationType.INFO,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    data: {
      type: Map,
      of: Schema.Types.Mixed,
      default: undefined,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({
  recipientId: 1,
  isRead: 1,
  createdAt: -1,
});

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema,
);
