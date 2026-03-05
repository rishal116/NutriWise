import { Types } from "mongoose";
import { IUserProgram } from "../models/userProgram.model";

export interface IUserProgramPopulated extends Omit<IUserProgram, "userId" | "nutritionistId"> {
  userId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
  };

  nutritionistId: {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
  };
}