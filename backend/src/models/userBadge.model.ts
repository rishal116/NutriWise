// userBadge.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserBadge extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  badgeId: mongoose.Types.ObjectId;

  earnedAt: Date;

  challengeId?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    badgeId: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },

    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },

    earnedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

UserBadgeSchema.index(
  { userId: 1, badgeId: 1 },
  { unique: true }
);

export default mongoose.model<IUserBadge>(
  "UserBadge",
  UserBadgeSchema
);