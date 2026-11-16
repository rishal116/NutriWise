import type { Types } from "mongoose";
import type { INutritionistPlan } from "../../../models/nutritionistPlan.model";

export interface StripeCheckoutData {
  userId: Types.ObjectId;
  nutritionistId: Types.ObjectId;
  planId: Types.ObjectId;
  plan: INutritionistPlan;
  paymentIntentId: string;
  amountInPaise: number;
  adminId: string;
}
