export interface UserDashboardOverviewDTO {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  upcomingPrograms: number;
  pausedPrograms: number;
  cancelledPrograms: number;
  upcomingConsultations: number;
  unreadNotifications: number;
  activeChallenges: number;
  completedChallenges: number;
}