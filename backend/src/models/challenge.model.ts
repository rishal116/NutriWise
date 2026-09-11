import { Schema, model, Types } from "mongoose";

export const CHALLENGE_CATEGORIES = [
  "nutrition",
  "hydration",
  "fitness",
  "sleep",
  "mindfulness",
  "healthy_habits",
  "wellness",
  "weight_management",
] as const;
export type ChallengeCategory = (typeof CHALLENGE_CATEGORIES)[number];

export const CHALLENGE_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type ChallengeDifficulty = (typeof CHALLENGE_DIFFICULTIES)[number];

export const CHALLENGE_ACCESS_TYPES = ["free", "premium"] as const;
export type ChallengeAccessType = (typeof CHALLENGE_ACCESS_TYPES)[number];

export const CHALLENGE_STATUSES = ["draft", "published", "archived"] as const;
export type ChallengeStatus = (typeof CHALLENGE_STATUSES)[number];

export interface IChallenge {
  _id: Types.ObjectId;
  title: string;
  description: string;
  instructions?: string;
  thumbnailUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  status: ChallengeStatus;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    instructions: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: CHALLENGE_CATEGORIES,
      required: true,
      index: true,
    },

    difficulty: {
      type: String,
      enum: CHALLENGE_DIFFICULTIES,
      required: true,
      index: true,
    },

    accessType: {
      type: String,
      enum: CHALLENGE_ACCESS_TYPES,
      required: true,
      default: "free",
      index: true,
    },

    durationDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    status: {
      type: String,
      enum: CHALLENGE_STATUSES,
      required: true,
      default: "draft",
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ChallengeSchema.index({
  status: 1,
  accessType: 1,
});

ChallengeSchema.index({
  category: 1,
  difficulty: 1,
  status: 1,
});

export const ChallengeModel = model<IChallenge>("Challenge", ChallengeSchema);
