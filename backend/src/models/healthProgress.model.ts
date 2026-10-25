import { Schema, model, Types } from "mongoose";

export interface IHealthProgress {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  date: Date;
  weightKg: number;
  bmi?: number;
  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

const healthProgressSchema = new Schema<IHealthProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    weightKg: {
      type: Number,
      required: true,
      min: 1,
      max: 700,
    },
    bmi: {
      type: Number,
      min: 1,
      max: 100,
    },
    dailyWaterIntakeLiters: {
      type: Number,
      min: 0,
    },
    sleepDurationHours: {
      type: Number,
      min: 0,
      max: 24,
    },
  },
  { timestamps: true },
);

healthProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const HealthProgressModel = model<IHealthProgress>(
  "HealthProgress",
  healthProgressSchema,
);
