import { Schema, model, Types } from "mongoose";

export interface IPlan {
  _id: Types.ObjectId;
  nutritionistId: Types.ObjectId;

  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;

  status: "draft" | "published";
  approvalStatus : | "pending" | "approved" | "rejected";
  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "Nutritionist",
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
      min: 99,
      max: 100000,
      required: true,
    },

    description: { type: String, required: true },

    status:{
      type:String,
      enum:["draft","published"]
    },

    approvalStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const PlanModel = model<IPlan>("Plan", PlanSchema);
