import { Schema, model, Types } from "mongoose";

export enum AIInsightType {
  ADHERENCE = "adherence",
  PROGRESS = "progress",
  HEALTH = "health",
  ACTIVITY = "activity",
  RISK = "risk",
  RECOMMENDATION = "recommendation",
  REMINDER = "reminder",
  ACHIEVEMENT = "achievement",
  GENERAL = "general",
}

export enum AIInsightPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum AIInsightStatus {
  UNREAD = "unread",
  READ = "read",
  DISMISSED = "dismissed",
  ACTED = "acted",
}

export interface IUserAIInsightSource {
  userDayTrackingId?: Types.ObjectId;
  userActivityTrackingId?: Types.ObjectId;
  userDailyCheckInId?: Types.ObjectId;
  userWeeklyCheckInId?: Types.ObjectId;
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
  provider: string;
  confidence?: number;
  status: AIInsightStatus;
  source?: IUserAIInsightSource;
  actionLabel?: string;
  actionUrl?: string;
  generatedAt: Date;
  expiresAt?: Date | null;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AIInsightSourceSchema = new Schema<IUserAIInsightSource>(
  {
    userDayTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserDayTracking",
    },

    userActivityTrackingId: {
      type: Schema.Types.ObjectId,
      ref: "UserActivityTracking",
    },

    userDailyCheckInId: {
      type: Schema.Types.ObjectId,
      ref: "UserDailyCheckIn",
    },

    userWeeklyCheckInId: {
      type: Schema.Types.ObjectId,
      ref: "UserWeeklyCheckIn",
    },
  },
  {
    _id: false,
  },
);

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
      default: null,
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
      default: null,
    },

    provider: {
      type: String,
      required: true,
      default: "openai",
      trim: true,
      maxlength: 100,
    },

    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    status: {
      type: String,
      enum: Object.values(AIInsightStatus),
      default: AIInsightStatus.UNREAD,
      index: true,
    },

    source: {
      type: AIInsightSourceSchema,
      default: null,
    },

    actionLabel: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    actionUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
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
  userId: 1,
  status: 1,
  isArchived: 1,
});
UserAIInsightSchema.index({
  userProgramId: 1,
  type: 1,
});
UserAIInsightSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const UserAIInsightModel = model<IUserAIInsight>(
  "UserAIInsight",
  UserAIInsightSchema,
);