export interface NutriDashboardEarningsChartDTO {
  currency: string;
  period: {
    from: Date;
    to: Date;
  };
  data: NutriDashboardEarningsChartItemDTO[];
}

export interface NutriDashboardEarningsChartItemDTO {
  month: string;
  year: number;
  earnings: number;
  transactions: number;
}