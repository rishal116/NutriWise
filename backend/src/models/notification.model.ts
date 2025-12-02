import { Schema, model, Document, Types } from "mongoose";

export type NotificationType = "info" | "success" | "warning" | "error";
export type RecipientType = "user" | "admin";

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  recipientType: RecipientType;
  receiverId: Types.ObjectId;
  senderId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    read: { type: Boolean, default: false },
    recipientType: { type: String, enum: ["user", "admin"], required: true },
    receiverId: { type: Schema.Types.ObjectId, required: true },
    senderId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>("Notification", NotificationSchema);
