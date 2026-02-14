import { Schema, model, Types } from "mongoose";

export interface IUserPlan {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  stripeSessionId: string;
  amount: number;
  currency: string;
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserPlanSchema = new Schema<IUserPlan>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    nutritionistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "EXPIRED"],
      default: "ACTIVE",
      index: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const UserPlanModel = model<IUserPlan>("UserPlan", UserPlanSchema);
