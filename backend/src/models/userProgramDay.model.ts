import { Schema, model, Types } from "mongoose";

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export interface IUserProgramMeal {
  _id: Types.ObjectId;
  mealType: MealType;
  title: string;
  description?: string;
  calories?: number;
  order: number;
}

export interface IUserProgramWorkout {
  _id: Types.ObjectId;
  title: string;
  duration: number;
  instructions?: string;
  order: number;
}

export interface IUserProgramHabit {
  _id: Types.ObjectId;
  title: string;
  targetValue?: number;
  unit?: string;
  order: number;
}

export interface IUserProgramDay {
  _id: Types.ObjectId;
  userProgramId: Types.ObjectId;
  dayNumber: number;
  meals: IUserProgramMeal[];
  workouts: IUserProgramWorkout[];
  habits: IUserProgramHabit[];
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IUserProgramMeal>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    mealType: {
      type: String,
      enum: MEAL_TYPES,
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
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const WorkoutSchema = new Schema<IUserProgramWorkout>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
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
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const HabitSchema = new Schema<IUserProgramHabit>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
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
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const UserProgramDaySchema = new Schema<IUserProgramDay>(
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
    },
    meals: {
      type: [MealSchema],
      default: [],
    },
    workouts: {
      type: [WorkoutSchema],
      default: [],
    },
    habits: {
      type: [HabitSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

UserProgramDaySchema.index(
  {
    userProgramId: 1,
    dayNumber: 1,
  },
  {
    unique: true,
  },
);

export const UserProgramDayModel = model<IUserProgramDay>(
  "UserProgramDay",
  UserProgramDaySchema,
);
