
import { Schema, Types, model } from "mongoose";

export enum DailyCheckInMood {
  VERY_BAD = "very_bad",
  BAD = "bad",
  NEUTRAL = "neutral",
  GOOD = "good",
  EXCELLENT = "excellent",
}

export enum DailyCheckInLevel {
  VERY_LOW = "very_low",
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  VERY_HIGH = "very_high",
}

export interface IUserDailyCheckIn {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;
  userDayTrackingId?: Types.ObjectId | null;
  date: Date;
  mood: DailyCheckInMood;
  energy: DailyCheckInLevel;
  stress: DailyCheckInLevel;
  motivation: DailyCheckInLevel;
  hunger: DailyCheckInLevel;
  sleepHours?: number;
  waterIntakeMl?: number;
  painLevel?: number;
  digestion?: DailyCheckInLevel;
  userNotes?: string;
  nutritionistNotes?: string;
  evidence: string[];
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserDailyCheckInSchema = new Schema<IUserDailyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
    },

    userDayTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserDayTracking",
      default: null,
    },

    date: {
      type: Date,
      required: true,
    },

    mood: {
      type: String,
      enum: Object.values(DailyCheckInMood),
      required: true,
    },

    energy: {
      type: String,
      enum: Object.values(DailyCheckInLevel),
      required: true,
    },

    stress: {
      type: String,
      enum: Object.values(DailyCheckInLevel),
      required: true,
    },

    motivation: {
      type: String,
      enum: Object.values(DailyCheckInLevel),
      required: true,
    },

    hunger: {
      type: String,
      enum: Object.values(DailyCheckInLevel),
      required: true,
    },

    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    waterIntakeMl: {
      type: Number,
      min: 0,
    },

    painLevel: {
      type: Number,
      min: 0,
      max: 10,
      validate: {
        validator: (value: number) => Number.isInteger(value),
        message: "Pain level must be an integer from 0 to 10.",
      },
    },

    digestion: {
      type: String,
      enum: Object.values(DailyCheckInLevel),
    },

    userNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    nutritionistNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    evidence: {
      type: [String],
      default: [],
      validate: {
        validator: (items: string[]) => items.length <= 10,
        message: "Maximum 10 evidence attachments are allowed.",
      },
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserDailyCheckInSchema.index(
  { userId: 1, userProgramId: 1, date: 1 },
  { unique: true },
);

UserDailyCheckInSchema.index({ userProgramId: 1, date: -1 });

export const UserDailyCheckInModel = model<IUserDailyCheckIn>(
  "UserDailyCheckIn",
  UserDailyCheckInSchema,
);
