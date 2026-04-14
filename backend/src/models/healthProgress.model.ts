import { Schema, model, Types, Document } from "mongoose";

export interface IHealthProgress extends Document {
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
      index: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    weightKg: {
      type: Number,
      required: true,
    },

    bmi: {
      type: Number,
    },

    dailyWaterIntakeLiters: {
      type: Number,
    },

    sleepDurationHours: {
      type: Number,
    },
  },
  { timestamps: true }
);

healthProgressSchema.index(
  { userId: 1, date: 1 },
  { unique: true }
);

export const HealthProgressModel = model<IHealthProgress>(
  "HealthProgress",
  healthProgressSchema
);