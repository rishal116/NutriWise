export type ProgramStatus =
  "upcoming" | "active" | "paused" | "completed" | "cancelled";

export interface ClientProgramSummaryDTO {
  userProgramId: string;
  userPlanId: string;
  nutritionistPlanId: string;

  planTitle: string;
  programStatus: ProgramStatus;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: string;
  endDate: string;
}

export interface ClientListItemDTO {
  clientId: string;
  fullName: string;
  profileImage?: string;

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
  email: string;

  phone?: string;
  birthDate?: string;
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
