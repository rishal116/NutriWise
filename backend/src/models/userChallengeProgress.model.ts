import { Schema, model, Types } from "mongoose";

export interface IUserChallengeProgress {
  _id: Types.ObjectId;

  userChallengeId: Types.ObjectId;
  userId: Types.ObjectId;
  challengeId: Types.ObjectId;

  dateKey: string;

  value?: number;
  durationMinutes?: number;
  isCompleted?: boolean;

  note?: string;

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
  },
  {
    timestamps: true,
  },
);

UserChallengeProgressSchema.index(
  {
    userChallengeId: 1,
    dateKey: 1,
  },
  {
    unique: true,
  },
);

UserChallengeProgressSchema.index({
  userId: 1,
  challengeId: 1,
  dateKey: 1,
});

export const UserChallengeProgressModel = model<IUserChallengeProgress>(
  "UserChallengeProgress",
  UserChallengeProgressSchema,
);
