import { Schema, model, Types, Document } from "mongoose";

export interface IHealthProgress extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  date: Date;

  weightKg: number;
  bmi?: number;

  dailyWaterIntakeLiters?: number;
  sleepDurationHours?: number;

  bodyFatPercentage?: number;
  caloriesConsumed?: number;
  workoutCompleted?: boolean;
  notes?: string;

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
      required: true,
      default: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      },
    },

    weightKg: {
      type: Number,
      required: true,
      min: 20,
      max: 500,
    },

    bmi: {
      type: Number,
      min: 5,
      max: 100,
    },

    dailyWaterIntakeLiters: {
      type: Number,
      min: 0,
      max: 20,
    },

    sleepDurationHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    bodyFatPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    caloriesConsumed: {
      type: Number,
      min: 0,
      max: 10000,
    },

    workoutCompleted: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

healthProgressSchema.index(
  { userId: 1, date: 1 },
  { unique: true },
);

export const HealthProgressModel = model<IHealthProgress>(
  "HealthProgress",
  healthProgressSchema,
);