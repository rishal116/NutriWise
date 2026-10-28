export class AdminDashboardPendingNutritionistDTO {
  id!: string;
  userId!: string;
  fullName!: string;
  email!: string;
  applicationStatus!: "pending";
  createdAt!: Date;
}