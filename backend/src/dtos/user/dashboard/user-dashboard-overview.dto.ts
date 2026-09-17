export interface UserDashboardOverviewDTO {
  user: {
    fullName: string;
    profileImage?: string;
  };

  coaching: {
    activeProgram: {
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
    } | null;
  };

  summary: {
    activePrograms: number;
    joinedChallenges: number;
  };
}
