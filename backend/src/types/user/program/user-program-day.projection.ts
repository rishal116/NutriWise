import { Types } from "mongoose";
import {
  IUserProgramMeal,
  IUserProgramWorkout,
  IUserProgramHabit,
} from "../../../models/userProgramDay.model";

export interface IUserProgramDayListProjection {
  _id: Types.ObjectId;
  dayNumber: number;
  mealCount: number;
  workoutCount: number;
  habitCount: number;
}

export interface IUserProgramDayDetailsProjection {
  _id: Types.ObjectId;
  dayNumber: number;
  meals: IUserProgramMeal[];
  workouts: IUserProgramWorkout[];
  habits: IUserProgramHabit[];
}
