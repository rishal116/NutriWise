import { Schema, model, Types } from "mongoose";

export type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack";

export interface IProgramDay {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;

  meals?: {
    _id?: Types.ObjectId;
    mealType: MealType;
    title: string;
    description?: string;
    calories?: number;
  }[];

  workouts?: {
    _id?: Types.ObjectId;
    title: string;
    duration: number;
    instructions?: string;
  }[];

  habits?: {
    _id?: Types.ObjectId;
    title: string;
    targetValue?: number;
    unit?: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const ProgramDaySchema = new Schema<IProgramDay>(
  {
    userProgramId: {
      type: Schema.Types.ObjectId,
      ref: "UserProgram",
      required: true,
      index: true,
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      index: true,
    },

    meals: [
      {
        mealType: {
          type: String,
          enum: ["breakfast", "lunch", "dinner", "snack"],
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: String,
        calories: {
          type: Number,
          min: 0,
        },
      },
    ],

    workouts: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        duration: {
          type: Number,
          required: true,
          min: 1,
        },
        instructions: String,
      },
    ],

    habits: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        targetValue: {
          type: Number,
          min: 0,
        },
        unit: String,
      },
    ],
  },
  { timestamps: true }
);

ProgramDaySchema.index(
  { userProgramId: 1, dayNumber: 1 },
  { unique: true }
);

export const ProgramDayModel = model<IProgramDay>(
  "ProgramDay",
  ProgramDaySchema
);