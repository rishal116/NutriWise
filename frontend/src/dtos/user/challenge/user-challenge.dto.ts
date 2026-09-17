export interface UserChallengeDTO {
  id: string;
  challengeId: string;
  status: "active" | "completed" | "abandoned";
  joinedAt: string;
  startedAt: string;
  currentDay: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  completedAt?: string;
}
