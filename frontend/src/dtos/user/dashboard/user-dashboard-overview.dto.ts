export interface UserDashboardActiveProgramDTO {
  id: string;
  title: string;
  nutritionist: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  status: string;
  currentDay: number;
  durationDays: number;
  completionPercentage: number;
  startDate: string;
  endDate: string;
}

export interface UserDashboardOverviewDTO {
  user: {
    fullName: string;
    profileImage?: string;
  };

  coaching: {
    activeProgram: UserDashboardActiveProgramDTO | null;
  };

  summary: {
    activePrograms: number;
    joinedChallenges: number;
  };
}
