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
      match: [/\S+@\S+\.\S+/, 'Invalid email'],
      index: true,
    },
    otp: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

otpSchema.index({ email: 1 }, { unique: true });

export const OtpModel = model<IOTP>("Otp", otpSchema);
