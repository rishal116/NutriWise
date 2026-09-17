export interface AdminPlanListItemDTO {
  id: string;
  nutritionistId: string;

  nutritionist: {
    fullName: string;
    profileImage?: string;
  };

  title: string;
  specialization: string;
  durationDays: number;
  price: number;
  currency: string;
  status: "draft" | "published" | "archived";

  createdAt: string;
}
