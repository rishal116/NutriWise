import type { Types } from "mongoose";

import type { Currency } from "../../../constants/common/currency.constants";
import type { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface IUserProgramDetailsProjection {
  _id: Types.ObjectId;
  userPlanId: Types.ObjectId;

  title: string;
  description?: string;
  specialization: Specialization;
  features: string[];

  purchaseDate: Date;
  purchaseAmount: number;
  currency: Currency;

  nutritionist: {
    _id: Types.ObjectId;
    fullName: string;
    username: string;
    profileImage?: string;
  };

  status: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date | null;
  endDate: Date | null;
}
