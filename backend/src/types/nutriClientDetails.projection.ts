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

export interface IClientProgramDetailsProjection {
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
}

export interface IClientDetailsProjection {
  clientId: Types.ObjectId;

  // Client information
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  birthDate?: Date;
  gender?: string;
  profileImage?: string;

  // Health information
  health: IClientHealthProjection;

  // Purchased programs
  programs: IClientProgramDetailsProjection[];
}
