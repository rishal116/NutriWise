import mongoose, { Schema, Document, Types } from "mongoose";

export type CreationMethod = "manual" | "ai";

export interface IAIInput {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
}

const AIInputSchema = new Schema<IAIInput>(
  {
    goal: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
  },
  { _id: false },
);

export interface IChallengeMedia {
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
}

const ChallengeMediaSchema = new Schema<IChallengeMedia>(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: String,
    title: String,
    description: String,
    duration: Number,
  },
  { _id: false },
);

export interface IChallenge extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid" | "productivity";
  creationMethod: CreationMethod;
  aiInput?: IAIInput | null;
  status: "draft" | "published" | "archived";
  createdBy: Types.ObjectId;
  tags: string[];
  category:
  | "weight_loss"
  | "muscle_gain"
  | "mental_wellness"
  | "hydration"
  | "productivity"
  | "custom";
  customCategory?: string | null;
  isPremium: boolean;
  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;
  media: IChallengeMedia[];
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalReviews: number;
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  visibility: "public" | "private";
  benefits: string[];
  equipmentNeeded: string[];
  estimatedCaloriesBurn?: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
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

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      maxlength: 300,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    type: {
      type: String,
      enum: ["fitness", "nutrition", "mental", "hybrid", "productivity"],
      required: true,
    },

    creationMethod: {
      type: String,
      enum: ["manual", "ai"],
      default: "manual",
      required: true,
    },

    aiInput: {
      type: AIInputSchema,
      default: null,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "mental_wellness",
        "hydration",
        "productivity",
        "custom",
      ],
      default: "custom",
    },

    customCategory: {
      type: String,
      trim: true,
      default: null,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },

    coverImage: String,
    bannerImage: String,
    introVideo: String,

    media: {
      type: [ChallengeMediaSchema],
      default: [],
    },

    totalEnrollments: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    seoTitle: String,
    seoDescription: String,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isRecommended: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    benefits: {
      type: [String],
      default: [],
    },

    equipmentNeeded: {
      type: [String],
      default: [],
    },

    estimatedCaloriesBurn: Number,

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

ChallengeSchema.index({ status: 1 });
ChallengeSchema.index({ difficulty: 1 });
ChallengeSchema.index({ type: 1 });
ChallengeSchema.index({ category: 1 });
ChallengeSchema.index({ isFeatured: 1 });
ChallengeSchema.index({ isPremium: 1 });
ChallengeSchema.index({ creationMethod: 1 });
ChallengeSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

export default mongoose.model<IChallenge>("Challenge", ChallengeSchema);
