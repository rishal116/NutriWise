// challengeReview.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChallengeReview extends Document {
  _id: Types.ObjectId;

  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;

  rating: number;

  review?: string;

  difficultyFeedback?: "easy" | "medium" | "hard";

  wouldRecommend: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeReviewSchema = new Schema<IChallengeReview>(
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

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    review: String,

    difficultyFeedback: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    wouldRecommend: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ChallengeReviewSchema.index(
  { userId: 1, challengeId: 1 },
  { unique: true }
);

ChallengeReviewSchema.index({
  challengeId: 1,
  rating: -1,
});

export default mongoose.model<IChallengeReview>(
  "ChallengeReview",
  ChallengeReviewSchema
);