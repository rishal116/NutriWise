import { SubscriptionStatus } from "../../../models/userPlan.model";
import { ProgramStatus } from "../../../models/userProgram.model";

export class ClientListItemDTO {
  clientId!: string;

  userProgramId!: string;

  userPlanId!: string;

  planId!: string;

  fullName!: string;

  username!: string;

  profileImage?: string;

  planTitle!: string;

  subscriptionStatus!: SubscriptionStatus;

  programStatus!: ProgramStatus;

  currentDay!: number;

  durationDays!: number;

  completionPercentage!: number;

  startDate!: Date;

  endDate!: Date;
}

export class ClientListResponseDTO {
  items!: ClientListItemDTO[];

  nextCursor: string | null = null;

  hasNextPage!: boolean;
}

export class ClientHealthDetailsDTO {
  heightCm!: number;

  weightKg!: number;

  activityLevel!: string;

  dietType!: string;

  goal!: string;

  targetWeightKg?: number;

  preferredTimeline!: string;
}

export class ClientProgramSummaryDTO {
  userProgramId!: string;

  userPlanId!: string;

  nutritionistPlanId!: string;

  title!: string;

  durationDays!: number;

  currentDay!: number;

  completionPercentage!: number;

  status!: ProgramStatus;

  startDate!: Date;

  endDate!: Date;
}

export class ClientDetailsResponseDTO {
  clientId!: string;

  fullName!: string;

  username!: string;

  email!: string;

  phone?: string;

  birthDate?: Date;

  gender?: string;

  profileImage?: string;

  health!: ClientHealthDetailsDTO;

  program!: ClientProgramSummaryDTO;
}
