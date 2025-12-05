import { Schema, model, Document, Types } from "mongoose";

/* -------------------- Types -------------------- */

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface TimeRange {
  id: string;
  start: string; // "09:00"
  end: string;   // "10:30"
  duration?:number;
}

export interface SpecialDay {
  id: string;
  date: string;       // "2025-12-04"
  ranges: TimeRange[];
  blocked?: boolean;  // full day blocked
}

export interface INutritionistAvailability extends Document {
  userId: Types.ObjectId; // link to User collection
  weekly: Record<Day, TimeRange[]>;
  special: SpecialDay[];
  consultDuration: number;
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------- Sub-Schemas -------------------- */

const timeRangeSchema = new Schema<TimeRange>(
  {
    id: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    duration: { type: String, required: false },
  },
  { _id: false } // prevent Mongoose from creating its own _id
);

const specialDaySchema = new Schema<SpecialDay>(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    ranges: { type: [timeRangeSchema], default: [] },
    blocked: { type: Boolean, default: false },
  },
  { _id: false }
);

/* -------------------- Main Schema -------------------- */

const nutritionistAvailabilitySchema = new Schema<INutritionistAvailability>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekly: {
      type: Map,
      of: [timeRangeSchema],
      default: () => {
        const map: Record<Day, TimeRange[]> = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };
        return map;
      },
    },
    special: { type: [specialDaySchema], default: [] },
    consultDuration: { type: Number, default: 30 },
  },
  { timestamps: true }
);

/* -------------------- Model -------------------- */

export const NutritionistAvailabilityModel = model<INutritionistAvailability>(
  "NutritionistAvailability",
  nutritionistAvailabilitySchema
);
