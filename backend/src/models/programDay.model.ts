import { Schema, model, Types } from "mongoose";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

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
    order?: number;
  }[];

  workouts?: {
    _id?: Types.ObjectId;
    title: string;
    duration: number;
    instructions?: string;
    order?: number;
  }[];

  habits?: {
    _id?: Types.ObjectId;
    title: string;
    targetValue?: number;
    unit?: string;
    order?: number;
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
    },

    dayNumber: {
      type: Number,
      required: true,
      min: 1,
    },

    meals: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },

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

        description: {
          type: String,
          trim: true,
        },

        calories: {
          type: Number,
          min: 0,
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    workouts: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },

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

        instructions: {
          type: String,
          trim: true,
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    habits: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },

        title: {
          type: String,
          required: true,
          trim: true,
        },

        targetValue: {
          type: Number,
          min: 0,
        },

        unit: {
          type: String,
          trim: true,
        },

        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  { timestamps: true },
);

ProgramDaySchema.index({ userProgramId: 1, dayNumber: 1 }, { unique: true });


export const ProgramDayModel = model<IProgramDay>(
  "ProgramDay",
  ProgramDaySchema,
);
