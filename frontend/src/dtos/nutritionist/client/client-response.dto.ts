export type SubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled"
  | "pending";

export type ProgramStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface ClientListItemDTO {
  clientId: string;
  userProgramId: string;
  userPlanId: string;
  planId: string;

  fullName: string;
  username: string;
  profileImage?: string;

  planTitle: string;

  subscriptionStatus: SubscriptionStatus;
  programStatus: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date;
  endDate: Date;
}

export interface ClientListResponseDTO {
  items: ClientListItemDTO[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface ClientHealthDetailsDTO {
  heightCm: number;
  weightKg: number;

  activityLevel: string;
  dietType: string;

  goal: string;
  targetWeightKg?: number;

  preferredTimeline: string;
}

export interface ClientProgramSummaryDTO {
  userProgramId: string;
  userPlanId: string;
  nutritionistPlanId: string;

  title: string;

  durationDays: number;
  currentDay: number;
  completionPercentage: number;

  status: ProgramStatus;

  startDate: Date;
  endDate: Date;
}

export interface ClientDetailsResponseDTO {
  clientId: string;

  fullName: string;
  username: string;
  email: string;

  phone?: string;
  birthDate?: Date;
  gender?: string;
  profileImage?: string;

  health: ClientHealthDetailsDTO;

  program: ClientProgramSummaryDTO;
}