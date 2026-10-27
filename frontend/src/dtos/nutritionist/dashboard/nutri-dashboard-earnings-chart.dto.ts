export interface NutriDashboardEarningsChartDTO {
  currency: string;
  period: {
    from: string;
    to: string;
  };
  data: NutriDashboardEarningsChartItemDTO[];
}

export interface NutriDashboardEarningsChartItemDTO {
  month: string;
  year: number;
  earnings: number;
  transactions: number;
}