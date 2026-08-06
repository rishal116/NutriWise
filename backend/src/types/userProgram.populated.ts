import { Types } from "mongoose";
import { IUserProgram } from "../models/userProgram.model";

export interface IUserProgramPopulated extends Omit<
  IUserProgram,
  "userId" | "nutritionistId" | "userPlanId" | "planId"
> {
  userId: {
    _id: Types.ObjectId;
    fullName: string;
    username: string;
    email: string;
    profileImage?: string;
  };

  nutritionistId: {
    _id: Types.ObjectId;
    fullName: string;
    username: string;
    email: string;
  };

  userPlanId: {
    _id: Types.ObjectId;
    subscriptionStatus: string;
    paymentStatus: string;
  };

  planId: {
    _id: Types.ObjectId;
    title: string;
    durationDays: number;
    price: number;
  };
}
