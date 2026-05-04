import mongoose, { Schema, Document, Types } from "mongoose";

export type CreationMethod = "manual" | "ai";

export interface IAIInput {
  goal: string;
  level: "beginner" | "intermediate" | "advanced";
}

export interface IChallengeMedia {
  type: "image" | "video" | "audio" | "pdf";
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
      enum: ["image", "video", "audio", "pdf"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: String,
    title: String,
    description: String,
    duration: Number,
  },
  { _id: false },
);

export interface IChallengeReward {
  xpPoints: number;
  badge?: string;
  certificate?: boolean;
  premiumUnlock?: boolean;
}

const ChallengeRewardSchema = new Schema<IChallengeReward>(
  {
    xpPoints: { type: Number, default: 0 },
    badge: String,
    certificate: { type: Boolean, default: false },
    premiumUnlock: { type: Boolean, default: false },
  },
  { _id: false },
);

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

export interface IChallenge extends Document {
  _id: Types.ObjectId;

  title: string;
  shortDescription?: string;
  description?: string;
  slug: string;

  duration: number;
  difficulty: "easy" | "medium" | "hard";
  type: "fitness" | "nutrition" | "mental" | "hybrid";

  creationMethod: CreationMethod;
  aiInput?: IAIInput;

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

  customCategory?: string;

  isPremium: boolean;

  coverImage?: string;
  bannerImage?: string;
  introVideo?: string;

  media: IChallengeMedia[];
  rewards: IChallengeReward;

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

  isDeleted: boolean;
  deletedAt?: Date | null;

  benefits: string[];
  equipmentNeeded: string[];

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },

    shortDescription: {
      type: String,
      maxlength: 300,
    },

    description: String,

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
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
      enum: ["fitness", "nutrition", "mental", "hybrid"],
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

    tags: [{ type: String }],

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

    rewards: {
      type: ChallengeRewardSchema,
      default: () => ({
        xpPoints: 0,
        certificate: false,
        premiumUnlock: false,
      }),
    },

    totalEnrollments: {
      type: Number,
      default: 0,
    },

    completionRate: {
      type: Number,
      default: 0,
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

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    benefits: {
      type: [String],
      default: [],
    },

    equipmentNeeded: {
      type: [String],
      default: [],
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
