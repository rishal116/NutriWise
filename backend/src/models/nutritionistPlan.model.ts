import { Schema, model, Types } from "mongoose";

export interface IPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  category:string;
  durationInDays: number;
  price: number;
  currency: string;
  description: string;
  features: string[];
  thumbnailUrl?: string;
  tags?: string[];
  status: "draft" | "published" | "archived";
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
      index: true,
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
      index: true,
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
  },
  { timestamps: true }
);

PlanSchema.index({
  nutritionistId: 1,
  status: 1,
  isDeleted: 1,
});

export const PlanModel = model<IPlan>("Plan", PlanSchema);