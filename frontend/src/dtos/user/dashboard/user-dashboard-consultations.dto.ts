export type MeetingStatus =
  | "scheduled"
  | "ongoing"
  | "completed"
  | "cancelled";

export interface UserDashboardConsultationDTO {
  _id: string;
  title: string;
  nutritionistId: string;
  scheduledAt: string;
  durationInMinutes: number;
  status: MeetingStatus;
}

export type UserDashboardConsultationsDTO =
  UserDashboardConsultationDTO[];