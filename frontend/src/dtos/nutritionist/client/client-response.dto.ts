export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export type ProgramStatus =
  | "upcoming"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export interface ClientProgramSummaryDTO {
  userProgramId: string;
  userPlanId: string;
  nutritionistPlanId: string;

  planTitle: string;

  subscriptionStatus: SubscriptionStatus;
  programStatus: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: Date;
  endDate: Date;
}

export interface ClientListItemDTO {
  clientId: string;

  fullName: string;
  username: string;
  profileImage?: string;
  a;

  programs: ClientProgramSummaryDTO[];
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

  programs: ClientProgramSummaryDTO[];
}

export interface MeetingClientOptionDTO {
  id: string;
  fullName: string;
  email: string;
  profileImage?: string;
}
