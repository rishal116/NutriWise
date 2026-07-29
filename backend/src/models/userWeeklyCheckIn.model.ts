import { Schema, model, Types } from "mongoose";

export interface IUserWeeklyCheckIn {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  weekNumber: number;

  startDate: Date;

  endDate: Date;

  weightKg?: number;

  bodyFatPercentage?: number;

  muscleMassKg?: number;

  chestCm?: number;

  waistCm?: number;

  hipCm?: number;

  leftArmCm?: number;

  rightArmCm?: number;

  leftThighCm?: number;

  rightThighCm?: number;

  progressPhotos: string[];

  averageSleepHours?: number;

  averageWaterIntakeMl?: number;

  averageMood?: number;

  averageEnergy?: number;

  averageStress?: number;

  overallRating?: number;

  achievements?: string[];

  challenges?: string[];

  userNotes?: string;

  nutritionistFeedback?: string;

  nextWeekFocus?: string;

  createdAt: Date;

  updatedAt: Date;
}

const UserWeeklyCheckInSchema = new Schema<IUserWeeklyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
    },

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    weightKg: {
      type: Number,
      min: 0,
    },

    bodyFatPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },

    muscleMassKg: {
      type: Number,
      min: 0,
    },

    chestCm: {
      type: Number,
      min: 0,
    },

    waistCm: {
      type: Number,
      min: 0,
    },

    hipCm: {
      type: Number,
      min: 0,
    },

    leftArmCm: {
      type: Number,
      min: 0,
    },

    rightArmCm: {
      type: Number,
      min: 0,
    },

    leftThighCm: {
      type: Number,
      min: 0,
    },

    rightThighCm: {
      type: Number,
      min: 0,
    },

    progressPhotos: {
      type: [String],
      default: [],
    },

    averageSleepHours: {
      type: Number,
      min: 0,
      max: 24,
    },

    averageWaterIntakeMl: {
      type: Number,
      min: 0,
    },

    averageMood: {
      type: Number,
      min: 1,
      max: 5,
    },

    averageEnergy: {
      type: Number,
      min: 1,
      max: 5,
    },

    averageStress: {
      type: Number,
      min: 1,
      max: 5,
    },

    overallRating: {
      type: Number,
      min: 1,
      max: 5,
    },

    achievements: {
      type: [String],
      default: [],
    },

    challenges: {
      type: [String],
      default: [],
    },

    userNotes: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    nutritionistFeedback: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    nextWeekFocus: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

UserWeeklyCheckInSchema.index(
  {
    userProgramId: 1,
    weekNumber: 1,
  },
  {
    unique: true,
  },
);

UserWeeklyCheckInSchema.index({
  userId: 1,
  startDate: -1,
});

UserWeeklyCheckInSchema.index({
  userProgramId: 1,
  startDate: -1,
});

export const UserWeeklyCheckInModel = model<IUserWeeklyCheckIn>(
  "UserWeeklyCheckIn",
  UserWeeklyCheckInSchema,
);