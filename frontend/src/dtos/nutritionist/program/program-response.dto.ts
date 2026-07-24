export interface ProgramSummary {
  userProgramId: string;
  userId: string;
  userPlanId: string;
  planId: string;

  fullName: string;
  username: string;
  profileImage?: string;

  planTitle: string;

  status: string;

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: string;
  endDate: string;
}

export interface ProgramBrowseResponse {
  items: ProgramSummary[];
  nextCursor: string | null;
  hasMore: boolean;
}