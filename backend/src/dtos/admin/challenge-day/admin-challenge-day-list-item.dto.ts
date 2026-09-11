export interface AdminChallengeDayListItemDTO {
  id: string;
  challengeId: string;

  dayNumber: number;

  title?: string;
  description?: string;

  activityCount: number;

  createdAt: Date;
  updatedAt: Date;
}
