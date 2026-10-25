export interface AdminChallengeDayListProjection {
  id: string;
  challengeId: string;
  dayNumber: number;
  title?: string;
  activityCount: number;
}