import { Schema, model, Types } from "mongoose";

export interface IWeeklyCheckIn {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  userProgramId: Types.ObjectId;

  weekNumber: number;

  weight?: number;
  waist?: number;
  energyLevel?: number;
  mood?: number; 
  adherenceScore?: number; 

  notes?: string;
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const WeeklyCheckInSchema = new Schema<IWeeklyCheckIn>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
    },

    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    weight: { type: Number, min: 20, max: 400 },
    waist: { type: Number, min: 20, max: 200 },

    energyLevel: { type: Number, min: 1, max: 5 },
    mood: { type: Number, min: 1, max: 5 },
    adherenceScore: { type: Number, min: 0, max: 100 },

    notes: String,

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

WeeklyCheckInSchema.index(
  { userProgramId: 1, weekNumber: 1 },
  { unique: true }
);

WeeklyCheckInSchema.index(
  { userId: 1, userProgramId: 1, weekNumber: 1 }
);

export const WeeklyCheckInModel = model<IWeeklyCheckIn>(
  "WeeklyCheckIn",
  WeeklyCheckInSchema
);