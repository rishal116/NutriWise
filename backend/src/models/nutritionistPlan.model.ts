import { Schema, model, Types } from "mongoose";

export const PLAN_STATUS = ["draft", "published", "archived"] as const;

export type PlanStatus = typeof PLAN_STATUS[number];

export interface IPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  durationInDays: number;
  price: number;
  currency: "INR" | "USD";
  description: string;
  features: string[];
  thumbnailUrl?: string;
  tags?: string[];
  status: PlanStatus;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    durationInDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["INR", "USD"],
      default: "INR",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    thumbnailUrl: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: PLAN_STATUS,
      default: "draft",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

PlanSchema.index({
  nutritionistId: 1,
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

PlanSchema.index(
  { nutritionistId: 1, title: 1 },
  { unique: true }
);

PlanSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export const PlanModel = model<IPlan>("Plan", PlanSchema);