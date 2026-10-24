import { Types } from "mongoose";

import type { ProgramStatus } from "../../../models/userProgram.model";


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

export interface IMeetingClientOption {
  clientId: Types.ObjectId;
  fullName: string;
  email: string;
  profileImage?: string;
}