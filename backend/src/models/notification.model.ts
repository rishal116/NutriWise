// upgraded notification.model.ts
import { Schema, model, Document, Types } from "mongoose";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "challenge_reminder"
  | "task_completed"
  | "badge_unlocked"
  | "challenge_completed"
  | "leaderboard_update"
  | "system";

export type RecipientType =
  | "user"
  | "admin"
  | "nutritionist";

export interface INotificationAction {
  label?: string;
  url?: string;
}

export interface INotificationMetadata {
  challengeId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  badgeId?: Types.ObjectId;
  mediaUrl?: string;
}

export interface INotification extends Document {
  _id: Types.ObjectId;

  title: string;
  message: string;

  type: NotificationType;

  read: boolean;

  recipientType: RecipientType;

  receiverId: Types.ObjectId;

  senderId?: Types.ObjectId;

  action?: INotificationAction;

  metadata?: INotificationMetadata;

  scheduledAt?: Date;

  expiresAt?: Date;

  priority: "low" | "normal" | "high";

  delivered: boolean;

  deliveredAt?: Date;

  isArchived: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const NotificationActionSchema = new Schema<INotificationAction>(
  {
    label: String,
    url: String,
  },
  { _id: false }
);

const NotificationMetadataSchema = new Schema<INotificationMetadata>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },

    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },

    badgeId: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
    },

    mediaUrl: String,
  },
  { _id: false }
);

const NotificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "info",
        "success",
        "warning",
        "error",
        "challenge_reminder",
        "task_completed",
        "badge_unlocked",
        "challenge_completed",
        "leaderboard_update",
        "system",
      ],
      default: "info",
    },

    read: {
      type: Boolean,
      default: false,
    },

    recipientType: {
      type: String,
      enum: ["user", "admin", "nutritionist"],
      required: true,
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    senderId: {
      type: Schema.Types.ObjectId,
    },

    action: NotificationActionSchema,

    metadata: NotificationMetadataSchema,

    scheduledAt: Date,

    expiresAt: Date,

    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },

    delivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// User inbox
NotificationSchema.index({
  receiverId: 1,
  read: 1,
  createdAt: -1,
});

// Scheduled notifications
NotificationSchema.index({
  scheduledAt: 1,
  delivered: 1,
});

// Auto cleanup
NotificationSchema.index({
  expiresAt: 1,
});

// Notification type filtering
NotificationSchema.index({
  receiverId: 1,
  type: 1,
});

// Admin analytics
NotificationSchema.index({
  recipientType: 1,
  createdAt: -1,
});

export const NotificationModel = model<INotification>(
  "Notification",
  NotificationSchema
);