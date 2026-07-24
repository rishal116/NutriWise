import { Types } from "mongoose";
import { ProgramStatus } from "../models/userProgram.model";
import { SubscriptionStatus } from "../models/userPlan.model";

export interface IClientHealthProjection {
  heightCm: number;

  weightKg: number;

  activityLevel: string;

  dietType: string;

  goal: string;

  targetWeightKg?: number;

  preferredTimeline: string;
}

export interface IClientDetailsProjection {
  clientId: Types.ObjectId;

  fullName: string;

  username: string;

  email: string;

  phone?: string;

  birthDate?: Date;

  gender?: string;

  profileImage?: string;

  userProgramId: Types.ObjectId;

  userPlanId: Types.ObjectId;

  planId: Types.ObjectId;

  planTitle: string;

  subscriptionStatus: SubscriptionStatus;

  programStatus: ProgramStatus;

  currentDay: number;

  durationDays: number;

  completionPercentage: number;

  startDate: Date;

  endDate: Date;

  health: IClientHealthProjection;
}
