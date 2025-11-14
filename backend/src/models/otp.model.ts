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
      unique: true,
    },
    otp: {
      type: String,
      required: true,
      length: 6, // 6-digit OTP
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true, 
  }
);


export const OtpModel = model<IOTP>("Otp", otpSchema);
