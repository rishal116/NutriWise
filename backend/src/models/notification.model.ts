import { Schema, model, Document, Types } from "mongoose";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  userId?: Types.ObjectId;               
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["info","success","warning","error"], default: "info" },
    read: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>("Notification", NotificationSchema);
