export interface UserPlanDetailDTO {
  id: string;

  plan: {
    id: string;
    title: string;
    price: number;
    durationInDays: number;
  };

  nutritionist: {
    id: string;
    name: string;
  };

  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";

  startDate: Date;
  endDate: Date;

  program?: {
    id: string;
    goal: string;
    status: string;

    startDate: Date;
    endDate: Date;

    progress: {
      currentDay: number;
      completion: number;
      daysRemaining: number;
    };
  };
}