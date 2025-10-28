import { Schema, model, Document } from "mongoose";

export interface IOTP extends Document {
  _id: Schema.Types.ObjectId;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true, // Ensure one active OTP per email
    },
    otp: {
      type: String,
      required: true,
      length: 6, // 6-digit OTP
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 1 * 60 * 1000), // 1 minute expiry
      index: { expireAfterSeconds: 0 }, // MongoDB TTL auto deletion
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);


export const OtpModel = model<IOTP>("Otp", otpSchema);
