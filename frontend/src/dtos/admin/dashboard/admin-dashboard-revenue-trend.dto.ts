export interface AdminDashboardRevenueTrendDTO {
  date: string;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  commissionEarned: number;
  paymentCount: number;
}