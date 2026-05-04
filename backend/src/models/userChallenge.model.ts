// userChallenge.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserReward {
  badge?: string;
  pointsEarned: number;
  certificates?: string[];
}

export interface IUserChallenge extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;

  startDate: Date;
  endDate?: Date;

  currentDay: number;

  completedDays: number[];

  streak: number;
  longestStreak: number;

  status: "active" | "completed" | "failed" | "paused";

  completionPercentage: number;

  joinedAt: Date;
  lastActivityAt?: Date;

  totalTasksCompleted: number;
  totalTasksSkipped: number;

  rewards: IUserReward;

  notes?: string;

  remindersEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserRewardSchema = new Schema<IUserReward>(
  {
    badge: String,

    pointsEarned: {
      type: Number,
      default: 0,
    },

    certificates: [String],
  },
  { _id: false }
);

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: Date,

    currentDay: {
      type: Number,
      default: 1,
    },

    completedDays: {
      type: [Number],
      default: [],
    },

    streak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "failed", "paused"],
      default: "active",
    },

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    lastActivityAt: Date,

    totalTasksCompleted: {
      type: Number,
      default: 0,
    },

    totalTasksSkipped: {
      type: Number,
      default: 0,
    },

    rewards: {
      type: UserRewardSchema,
      default: () => ({
        pointsEarned: 0,
      }),
    },

    notes: String,

    remindersEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate challenge enrollment
UserChallengeSchema.index(
  { userId: 1, challengeId: 1 },
  { unique: true }
);

// Dashboard queries
UserChallengeSchema.index({ userId: 1, status: 1 });

// Leaderboard
UserChallengeSchema.index({ challengeId: 1, completionPercentage: -1 });

// Activity tracking
UserChallengeSchema.index({ userId: 1, lastActivityAt: -1 });

export default mongoose.model<IUserChallenge>(
  "UserChallenge",
  UserChallengeSchema
);