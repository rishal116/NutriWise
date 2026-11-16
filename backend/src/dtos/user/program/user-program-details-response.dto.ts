import type { Currency } from "../../../constants/common/currency.constants";
import type { Specialization } from "../../../constants/nutritionist/profile/specialization.constants";
import type { ProgramStatus } from "../../../constants/user/program/program-status.constants";

export interface IUserProgramDetailsResponseDTO {
  id: string;
  userPlanId: string;

  title: string;
  description?: string;
  specialization: Specialization;
  features: string[];

  purchaseDate: Date;
  purchaseAmount: number;
  currency: Currency;

  nutritionist: {
    id: string;
    fullName: string;
    username: string;
    profileImage?: string;
  };

  programStatus: ProgramStatus;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date | null;
  endDate: Date | null;
}
