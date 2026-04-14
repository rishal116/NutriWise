export interface UserPlanListDTO {
  id: string;

  title: string;
  price: number;
  durationInDays: number;

  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";

  startDate: Date;
  endDate: Date;

  program?: {
    goal: string;
    status: string;
    currentDay: number;
    completion: number;
    daysRemaining?: number;
  };
}