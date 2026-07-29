import { Schema, model, Types } from "mongoose";

export enum AIInsightType {
  MEAL_ADHERENCE = "meal_adherence",
  WORKOUT_ADHERENCE = "workout_adherence",
  HABIT_ADHERENCE = "habit_adherence",
  HYDRATION = "hydration",
  SLEEP = "sleep",
  MOOD = "mood",
  PROGRESS = "progress",
  RISK = "risk",
  RECOMMENDATION = "recommendation",
  GENERAL = "general",
}

export enum AIInsightPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface IUserAIInsight {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  userProgramId?: Types.ObjectId;

  type: AIInsightType;

  priority: AIInsightPriority;

  title: string;

  message: string;

  recommendation?: string;

  isRead: boolean;

  generatedAt: Date;

  expiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const UserAIInsightSchema = new Schema<IUserAIInsight>(
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
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(AIInsightType),
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: Object.values(AIInsightPriority),
      default: AIInsightPriority.MEDIUM,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    recommendation: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

UserAIInsightSchema.index({
  userId: 1,
  generatedAt: -1,
});

UserAIInsightSchema.index({
  userProgramId: 1,
  type: 1,
});

UserAIInsightSchema.index({
  userId: 1,
  isRead: 1,
});

export const UserAIInsightModel = model<IUserAIInsight>(
  "UserAIInsight",
  UserAIInsightSchema,
);