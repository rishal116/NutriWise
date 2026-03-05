export interface UserPlanResponseDTO {
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
  startDate: Date;
  endDate: Date;
}
