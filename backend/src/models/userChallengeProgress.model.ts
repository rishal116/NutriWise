import { Schema, model, Types } from "mongoose";

export interface IUserChallengeProgress {
  _id: Types.ObjectId;
  userChallengeId: Types.ObjectId;
  challengeDayId: Types.ObjectId;
  activityId: Types.ObjectId;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserChallengeProgressSchema = new Schema<IUserChallengeProgress>(
  {
    userChallengeId: {
      type: Schema.Types.ObjectId,
      ref: "UserChallenge",
      required: true,
    },

    challengeDayId: {
      type: Schema.Types.ObjectId,
      ref: "ChallengeDay",
      required: true,
    },

    activityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    completedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserChallengeProgressSchema.index(
  {
    userChallengeId: 1,
    challengeDayId: 1,
    activityId: 1,
  },
  {
    unique: true,
  },
);

UserChallengeProgressSchema.index({
  userChallengeId: 1,
  challengeDayId: 1,
});

UserChallengeProgressSchema.index({
  userChallengeId: 1,
  completedAt: 1,
});

export const UserChallengeProgressModel = model<IUserChallengeProgress>(
  "UserChallengeProgress",
  UserChallengeProgressSchema,
);
