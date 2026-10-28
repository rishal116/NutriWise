export interface UserDashboardMonthlySpendingDTO {
  year: number;
  month: number;
  amount: number;
}

export interface UserDashboardPaymentOverviewDTO {
  totalSpent: number;
  monthlySpending: UserDashboardMonthlySpendingDTO[];
  currency: string;
}