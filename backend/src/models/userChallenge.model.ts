import { Schema, model, Types } from "mongoose";

export const USER_CHALLENGE_STATUSES = [
  "active",
  "completed",
  "abandoned",
] as const;

export type UserChallengeStatus = (typeof USER_CHALLENGE_STATUSES)[number];

export interface IUserChallenge {
  _id: Types.ObjectId;

  userId: Types.ObjectId;
  challengeId: Types.ObjectId;

  status: UserChallengeStatus;

  joinedAt: Date;
  startedAt: Date;

  currentDay: number;

  progressPercentage: number;

  currentStreak: number;
  longestStreak: number;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeSchema = new Schema<IUserChallenge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: USER_CHALLENGE_STATUSES,
      required: true,
      default: "active",
      index: true,
    },

    joinedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    currentDay: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    progressPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },

    currentStreak: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    longestStreak: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

UserChallengeSchema.index(
  {
    userId: 1,
    challengeId: 1,
  },
  {
    unique: true,
  },
);

UserChallengeSchema.index({
  challengeId: 1,
  status: 1,
});

UserChallengeSchema.index({
  userId: 1,
  status: 1,
});

export const UserChallengeModel = model<IUserChallenge>(
  "UserChallenge",
  UserChallengeSchema,
);
