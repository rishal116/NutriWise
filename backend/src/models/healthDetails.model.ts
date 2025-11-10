import { Schema, model, Document, Types } from "mongoose";

export interface IHealthDetails extends Document {
  _id: string;
  userId: Types.ObjectId;
  height: number;
  weight: number;
  bmi: number;
  activityLevel: string;
  dietType: string;
  dailyWaterIntake: number;
  sleepDuration: string;
  goal: string;
  targetWeight: number;
  preferredTimeline: string;
  focusArea: string;
  createdAt: Date;
  updatedAt: Date;
}

const healthDetailsSchema = new Schema<IHealthDetails>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    bmi: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    dietType: { type: String, required: true },
    dailyWaterIntake: { type: Number, required: true },
    sleepDuration: { type: String, required: true },
    goal: { type: String, required: true },
    targetWeight: { type: Number, required: true },
    preferredTimeline: { type: String, required: true },
    focusArea: { type: String, required: true },
  },
  { timestamps: true }
);

export const HealthDetailsModel = model<IHealthDetails>(
  "HealthDetails",
  healthDetailsSchema
);
