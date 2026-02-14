export interface NutritionistSubscriberDTO {
  id: string;

  user: {
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

  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: Date;
  endDate: Date;
}
