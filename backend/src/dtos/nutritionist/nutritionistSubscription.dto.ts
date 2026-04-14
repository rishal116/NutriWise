export interface NutritionistSubscriptionDTO {
  id: string;

  user : {
    id: string;
    name: string;
    email: string;
  };

  plan: {
    id: string;
    title: string;
    price: number;
    durationInDays: number;
  };

  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PENDING";
  startDate: Date;
  endDate: Date;
}