// challengeLeaderboard.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChallengeLeaderboard extends Document {
  _id: Types.ObjectId;

  challengeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  rank: number;

  points: number;

  completionPercentage: number;

  streak: number;

  period: "daily" | "weekly" | "monthly" | "all-time";

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeLeaderboardSchema = new Schema<IChallengeLeaderboard>(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rank: Number,

    points: {
      type: Number,
      default: 0,
    },

    completionPercentage: {
      type: Number,
      default: 0,
    },

    streak: {
      type: Number,
      default: 0,
    },

    period: {
      type: String,
      enum: ["daily", "weekly", "monthly", "all-time"],
      default: "all-time",
    },
  },
  { timestamps: true }
);

ChallengeLeaderboardSchema.index({
  challengeId: 1,
  period: 1,
  rank: 1,
});

export default mongoose.model<IChallengeLeaderboard>(
  "ChallengeLeaderboard",
  ChallengeLeaderboardSchema
);