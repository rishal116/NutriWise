export interface AdminDashboardPendingNutritionistDTO {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  applicationStatus: "pending";
  createdAt: string;
}