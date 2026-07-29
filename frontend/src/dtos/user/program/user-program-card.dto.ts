export interface UserProgramCardDTO {
  _id: string;
  title: string;

  nutritionist: {
    _id: string;
    fullName: string;
    profileImage?: string;
  };

  status:
    | "upcoming"
    | "active"
    | "paused"
    | "completed"
    | "cancelled";

  currentDay: number;
  durationDays: number;
  completionPercentage: number;

  startDate: string;
  endDate: string;
}