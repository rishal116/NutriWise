export interface UserProgramDetailsDTO {
  _id: string;

  title: string;

  nutritionist: {
    _id: string;
    fullName: string;
    username: string;
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

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  subscriptionStatus:
    | "pending"
    | "active"
    | "expired"
    | "cancelled";
}