import { Types } from "mongoose";

import { MealType } from "../models/userProgramDay.model";

export interface IMealProjection {
  _id: Types.ObjectId;

  mealType: MealType;

  title: string;

  description?: string;

  calories?: number;

  order: number;
}

export interface IWorkoutProjection {
  _id: Types.ObjectId;

  title: string;

  duration: number;

  instructions?: string;

  order: number;
}

export interface IHabitProjection {
  _id: Types.ObjectId;

  title: string;

  targetValue?: number;

  unit?: string;

  order: number;
}

export interface IProgramDayProjection {
  userProgramDayId: Types.ObjectId;

  userProgramId: Types.ObjectId;

  dayNumber: number;

  meals: IMealProjection[];

  workouts: IWorkoutProjection[];

  habits: IHabitProjection[];

  createdAt: Date;

  updatedAt: Date;
}

export interface ProgramDayBrowseResult {
  items: IProgramDayProjection[];

  nextCursor: string | null;

  hasMore: boolean;
}
