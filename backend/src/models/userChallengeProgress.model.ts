import { Schema, model, Types } from "mongoose";

export interface IUserChallengeProgress {
  _id: Types.ObjectId;

  userChallengeId: Types.ObjectId;

  userId: Types.ObjectId;
  challengeId: Types.ObjectId;

  challengeDayId: Types.ObjectId;
  activityId: Types.ObjectId;

  dayNumber: number;

  dateKey: string;

  value?: number;
  durationMinutes?: number;

  isCompleted: boolean;

  note?: string;

  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeProgressSchema = new Schema<IUserChallengeProgress>(
  {
    userChallengeId: {
      type: Schema.Types.ObjectId,
      ref: "UserChallenge",
      required: true,
      index: true,
    },

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

    challengeDayId: {
      type: Schema.Types.ObjectId,
      ref: "ChallengeDay",
      required: true,
      index: true,
    },

    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    dateKey: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
      index: true,
    },

    value: {
      type: Number,
      min: 0,
    },

    durationMinutes: {
      type: Number,
      min: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

UserChallengeProgressSchema.index(
  {
    userChallengeId: 1,
    activityId: 1,
  },
  {
    unique: true,
  },
);

UserChallengeProgressSchema.index({
  userChallengeId: 1,
  dayNumber: 1,
});

UserChallengeProgressSchema.index({
  userId: 1,
  challengeId: 1,
  dateKey: 1,
});

export const UserChallengeProgressModel = model<IUserChallengeProgress>(
  "UserChallengeProgress",
  UserChallengeProgressSchema,
);
