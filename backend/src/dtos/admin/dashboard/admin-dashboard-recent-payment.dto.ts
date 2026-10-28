export class AdminDashboardRecentPaymentDTO {
  id!: string;
  userId!: string;
  customerName!: string;
  amount!: number;
  currency!: string;
  status!: "pending" | "paid" | "failed" | "refunded";
  createdAt!: Date;
}