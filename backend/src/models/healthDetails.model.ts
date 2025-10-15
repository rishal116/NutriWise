import { Schema, model, Document, Types } from "mongoose";

export interface IHealthDetails extends Document {
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    height: { type: Number },
    weight: { type: Number },
    bmi: { type: Number },
    activityLevel: { type: String },
    dietType: { type: String },
    dailyWaterIntake: { type: Number },
    sleepDuration: { type: String },
    goal: { type: String },
    targetWeight: { type: Number },
    preferredTimeline: { type: String },
    focusArea: { type: String },
  },
  { timestamps: true }
);

export const HealthDetailsModel = model<IHealthDetails>(
  "HealthDetails",
  healthDetailsSchema
);
