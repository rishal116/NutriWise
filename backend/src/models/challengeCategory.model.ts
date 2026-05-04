// challengeCategory.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChallengeCategory extends Document {
  _id: Types.ObjectId;

  name: string;
  slug: string;

  description?: string;

  icon?: string;
  bannerImage?: string;

  colorTheme?: string;

  type:
    | "fitness"
    | "nutrition"
    | "mental"
    | "hybrid"
    | "productivity"
    | "sleep"
    | "wellness";

  difficultyLevel?: "beginner" | "intermediate" | "advanced";

  popularityScore: number;

  totalChallenges: number;

  isActive: boolean;
  isFeatured: boolean;

  seoTitle?: string;
  seoDescription?: string;

  createdBy?: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeCategorySchema = new Schema<IChallengeCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: String,

    icon: String,

    bannerImage: String,

    colorTheme: String,

    type: {
      type: String,
      enum: [
        "fitness",
        "nutrition",
        "mental",
        "hybrid",
        "productivity",
        "sleep",
        "wellness",
      ],
      required: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },

    popularityScore: {
      type: Number,
      default: 0,
    },

    totalChallenges: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    seoTitle: String,

    seoDescription: String,

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Core indexes
ChallengeCategorySchema.index({ slug: 1 }, { unique: true });
ChallengeCategorySchema.index({ type: 1, difficultyLevel: 1 });
ChallengeCategorySchema.index({ isFeatured: 1, isActive: 1 });
ChallengeCategorySchema.index({ popularityScore: -1 });

// Search optimization
ChallengeCategorySchema.index({
  name: "text",
  description: "text",
});

// Auto-generate slug
ChallengeCategorySchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model<IChallengeCategory>(
  "ChallengeCategory",
  ChallengeCategorySchema
);