import { Schema, model, Types } from "mongoose";
import { HealthCategory } from "../constants/index";

export interface IPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  category: HealthCategory;
  durationInDays: number;
  price: number;
  currency: string;
  description: string;
  features: string[];
  thumbnailUrl?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
  isDeleted: boolean;
  version: number;
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

    title: { type: String, required: true },

    category: {
      type: String,
      enum: Object.values(HealthCategory),
      required: true,
      index: true,
    },

    durationInDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    description: { type: String, required: true },

    features: {
      type: [String],
      default: [],
    },

    thumbnailUrl: String,

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const PlanModel = model<IPlan>("Plan", PlanSchema);