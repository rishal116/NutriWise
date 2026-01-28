import { Schema, model, Types } from "mongoose";

export interface IPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  currency: string; 
  description: string;
  features: string[];
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  nutritionistId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  durationInDays: {
    type: Number,
    enum: [30, 90, 180],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ["INR", "USD", "EUR"],
    default: "INR",
    required: true,
  },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
},{ timestamps: true });

export const PlanModel = model<IPlan>("Plan", PlanSchema);
